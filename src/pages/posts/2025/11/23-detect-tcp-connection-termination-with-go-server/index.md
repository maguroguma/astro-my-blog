---
layout: '@/layouts/MarkdownPostLayout.astro'
title: 'HTTP リクエストのキャンセルを Go の web server で検知する'
pubDate: 2025-11-23
description: '不要になった外部リソースの処理をキャンセルする方法について、調べた内容を簡単にまとめたもの。'
tags: ["Go", "TCP"]
---

## はじめに

とある web server を開発しているしているときに、ふと思った疑問について調べたことの軽いまとめです。
AI とやりとりしながら知ったことなので、裏取りとかが若干甘いかもしれません。
ただ、ある程度の信憑性はありそうだと自分で判断はしたので、備忘録も兼ねて形にしておこうと思った次第です。

## 疑問

「データベースやネットワークの IO を含む、ある程度重い処理を含む HTTP リクエスト」を考えます。
まぁ、大体の Web サービスの HTTP リクエストはこうですよね。
これをブラウザが発行したとき、あまりにも待たされるとユーザは途中でリロードを連打してしまうかもしれません。
サービスの内容にもよりますが、このリロード連打によりさらに負荷がかかってユーザはさらに待たされることになる可能性があります。

こういった悪循環を断ち切るために、データベースをはじめとした外部リソースの処理を解放すべく、何かしらの方法でキャンセルしよう、となるのが自然だと思います。

以降では、便宜上 Go で web server を開発する場合を想定します。
簡単に思いつくのはタイムアウトで、最近のライブラリであれば `context.Context` により簡単に実現可能です。
ただ、タイムアウトの時間をどう決めるかは自明ではない気がします。
やはり、リクエストの切断を検知して、その瞬間にキャンセルをしたくなります。
でも、HTTP リクエストってステートレスだし、検知って出来るの？と考えていました。

## 回答: TCP 接続が閉じられるのを検知出来るよ！

HTTP レイヤでは切断のシグナルなどはないが、TCP レイヤで RST パケットの送信により切断がサーバ側に伝えられる、とのこと。
そういえば、TCP レイヤでは three-way handshaking とかしていて、セッションが張られていたよな…とか思い出しました。

Go の web server だと、リクエストにひもづいたコンテキストを経由して検知できます。
Echo や Fiber などのフレームワークでは、専用の型でリクエストが保持されているので、そこから `context.Context` を取り出せば OK っぽいです。
当然ながら、リクエストの中で新しく `context.Context` を生成しても、そこからは TCP 接続の切断は検知できないので注意が必要です。

## 実験用のコード

AI さんが出力してくれた以下の実験用コードで、具体的な振舞が確認できると思います。
`go run` したあと、ブラウザから `localhost:8888` にアクセスすれば OK です。
テスト内容も、アクセスしたページに書かれています。
親切だ。

```go
package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"time"
)

// HTTPリクエストのキャンセルを検証するサーバー
//
// このサーバーは、クライアントが接続を切断したときの動作を観察できます。

func main() {
	http.HandleFunc("/slow", slowHandler)
	http.HandleFunc("/", rootHandler)

	fmt.Println("=== HTTPキャンセルデモサーバー ===")
	fmt.Println("サーバーを起動しました: http://localhost:8888")
	fmt.Println()
	fmt.Println("テスト方法:")
	fmt.Println("1. ブラウザで http://localhost:8888/slow を開く")
	fmt.Println("2. ページが読み込まれる前に、すぐにタブを閉じる")
	fmt.Println("3. ターミナルの出力を確認")
	fmt.Println()

	log.Fatal(http.ListenAndServe(":8888", nil))
}

// rootHandler はトップページのハンドラーです
func rootHandler(w http.ResponseWriter, r *http.Request) {
	html := `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>HTTPキャンセルデモ</title>
</head>
<body>
    <h1>HTTPリクエストキャンセルのデモ</h1>

    <h2>テスト1: ページナビゲーションを途中で止める</h2>
    <p>
        <a href="/slow" target="_blank">遅いページを開く（新しいタブで開く）</a><br>
        → すぐにタブを閉じてください
    </p>

    <h2>テスト2: fetch APIでリクエストを途中で止める</h2>
    <button onclick="testFetch()">fetchリクエストを開始</button>
    <button onclick="cancelFetch()">リクエストをキャンセル</button>
    <div id="status"></div>

    <script>
        let abortController = null;

        function testFetch() {
            const status = document.getElementById('status');
            abortController = new AbortController();

            status.textContent = 'リクエスト中...';

            fetch('/slow', { signal: abortController.signal })
                .then(response => response.text())
                .then(data => {
                    status.textContent = '完了: ' + data;
                })
                .catch(err => {
                    status.textContent = 'エラー: ' + err.message;
                });
        }

        function cancelFetch() {
            if (abortController) {
                abortController.abort();
                document.getElementById('status').textContent = 'キャンセルしました';
            }
        }
    </script>
</body>
</html>
`
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	fmt.Fprint(w, html)
}

// slowHandler は意図的に遅いレスポンスを返すハンドラーです
func slowHandler(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	fmt.Println("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
	fmt.Printf("🔵 [%s] 新しいリクエストを受信\n", time.Now().Format("15:04:05"))
	fmt.Printf("   クライアント: %s\n", r.RemoteAddr)
	fmt.Printf("   URL: %s\n", r.URL.Path)

	// 10秒かかる重い処理をシミュレート
	for i := 1; i <= 10; i++ {
		select {
		case <-ctx.Done():
			// ★ コンテキストがキャンセルされた！ ★
			fmt.Printf("🔴 [%s] クライアントが接続を切断しました（%d/10秒後）\n", time.Now().Format("15:04:05"), i)
			fmt.Printf("   理由: %v\n", ctx.Err())

			// TCP接続の状態を確認
			if ctx.Err() == context.Canceled {
				fmt.Println("   → これはクライアントが接続を切断したことを意味します")
			}

			fmt.Println("   処理を中断します")
			fmt.Println("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
			return
		default:
			fmt.Printf("⏳ [%s] 処理中... %d/10秒\n", time.Now().Format("15:04:05"), i)
			time.Sleep(1 * time.Second)
		}
	}

	// 正常に完了した場合
	fmt.Printf("✅ [%s] 処理が完了しました\n", time.Now().Format("15:04:05"))
	fmt.Println("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

	w.Header().Set("Content-Type", "text/plain; charset=utf-8")
	fmt.Fprintf(w, "処理が完了しました（10秒かかりました）")
}
```

## おわりに

TCP/IP とか勉強したのはもう 15 年ほど前で、もはや IP アドレスやポート番号がどーのこーの、ぐらいしか記憶にありませんでした。
こういう内容を調べると、一回復習し直さないといけない気持ちになってきますね…。
IPA の試験勉強ついでとかに学び直してみるのがいいのかなぁ。
