describe('Shopping Cart', () => {
  beforeEach(() => {
    cy.visit('/products');
  });

  it('allows adding products to cart', () => {
    cy.get('[data-testid="product-card"]').first().within(() => {
      cy.get('[data-testid="add-to-cart"]').click();
    });

    cy.get('[data-testid="cart-count"]').should('have.text', '1');
  });

  it('allows updating quantities in cart', () => {
    // Add product to cart first
    cy.get('[data-testid="product-card"]').first().within(() => {
      cy.get('[data-testid="add-to-cart"]').click();
    });

    cy.visit('/cart');
    cy.get('[data-testid="quantity-input"]').clear().type('2');
    cy.get('[data-testid="cart-total"]').should('contain', '39.98');
  });

  it('completes checkout process', () => {
    // Add product and go to checkout
    cy.get('[data-testid="product-card"]').first().within(() => {
      cy.get('[data-testid="add-to-cart"]').click();
    });

    cy.visit('/cart');
    cy.get('[data-testid="checkout-button"]').click();

    // Fill shipping info
    cy.get('input[name="fullName"]').type('John Doe');
    cy.get('input[name="street"]').type('123 Main St');
    cy.get('input[name="city"]').type('Athens');
    cy.get('input[name="postalCode"]').type('12345');
    cy.get('input[name="phone"]').type('1234567890');

    // Complete order
    cy.get('[data-testid="place-order"]').click();
    cy.url().should('include', '/order-confirmation');
  });
});