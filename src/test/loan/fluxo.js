import http from 'k6/http';
import { check, sleep } from 'k6';

// Configurações do teste
export const options = {
  stages: [
    { duration: '1m', target: 100 },   // Sobe para 100 usuários em 1 minuto
    { duration: '2m', target: 1000 },  // Mantém 1000 usuários por 2 minutos
    { duration: '1m', target: 0 },     // Reduz para 0 usuários em 1 minuto
  ],
};


// Função utilitária para gerar string aleatória
function randomString(length) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let str = '';
  for (let i = 0; i < length; i++) {
    str += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return str;
}

// Gera dados de usuário únicos
function generateUserData() {
  const id = randomString(6);
  return {
    name: `User_${id}`,
    email: `user_${id}@example.com`,
    password: '123456',
  };
}

// Gera dados de despesa dinâmicos
function generateExpenseData(userId) {
  const descriptions = ['Netflix', 'Spotify', 'Amazon Prime', 'Uber', 'iFood'];
  const description = descriptions[Math.floor(Math.random() * descriptions.length)];
  return {
    amount: Math.floor(Math.random() * 5000) + 100, // entre 100 e 5100
    description,
    id_user: userId,
    status: 'pendente',
    is_recurring: true,
    recurring_count: 55, // de 1 a 12
  };
}

export default function () {
  const baseUrl = 'http://localhost:3003'; // Altere conforme necessário
  const userData = generateUserData();

  const userRes = http.post(`${baseUrl}/users`, JSON.stringify(userData), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(userRes, {
    'usuário criado': (res) => res.status === 201,
  });

  const user = JSON.parse(userRes.body)[0];
  const userId = user.id;

  const authRes = http.post(`${baseUrl}/auth/authenticate`, JSON.stringify({
    email: userData.email,
    password: userData.password,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(authRes, {
    'autenticado': (res) => res.status === 200,
  });

  const token = JSON.parse(authRes.body).body.token;

  const expenseData = generateExpenseData(userId);
  const expenseRes = http.post(`${baseUrl}/expenses`, JSON.stringify(expenseData), {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  check(expenseRes, {
    'despesa registrada': (res) => res.status === 201,
  });

  sleep(1);
}
