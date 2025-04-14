it('タイトルが正しい', () => {
  const page = cy.visit('http://localhost:4321');

  page.get('title').should('have.text', 'Astro最高!');
  page.get('h1').should('have.text', 'Hello world from Astro');
});
