it('コンテンツが正しい', () => {
  const page = cy.visit('http://localhost:4321');

  page.get('title').should('have.text', 'Leverage Copy');
  page.get('h1').should('have.text', 'Leverage Copy');

  page.get('h2').should('have.text', 'なんとか生きてる。');
});
