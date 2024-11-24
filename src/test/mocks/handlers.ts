import { http, HttpResponse } from 'msw';

export const handlers = [
  // Auth endpoints
  http.post('/api/auth/login', async ({ request }) => {
    const { email, password } = await request.json();
    
    if (email === 'test@example.com' && password === 'password') {
      return HttpResponse.json({
        user: {
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
          role: 'consumer',
        },
        token: 'fake-jwt-token',
      });
    }
    
    return new HttpResponse(null, {
      status: 401,
      statusText: 'Invalid credentials',
    });
  }),

  // Products endpoints
  http.get('/api/products', () => {
    return HttpResponse.json([
      {
        id: '1',
        name: 'Greek Olive Oil',
        description: 'Premium extra virgin olive oil',
        price: 19.99,
        image: 'https://source.unsplash.com/400x400/?olive,oil',
        category: 'food',
        producer: {
          id: '1',
          name: 'Olive Grove Farm',
        },
        stock: 100,
      },
    ]);
  }),

  // Orders endpoints
  http.get('/api/orders', ({ request }) => {
    const headers = request.headers;
    const auth = headers.get('Authorization');

    if (!auth) {
      return new HttpResponse(null, { status: 401 });
    }

    return HttpResponse.json([
      {
        id: '1',
        items: [
          {
            product: '1',
            quantity: 2,
            price: 19.99,
          },
        ],
        total: 39.98,
        status: 'pending',
        createdAt: new Date().toISOString(),
      },
    ]);
  }),
];