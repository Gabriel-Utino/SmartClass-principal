// script.js

// パスワード表示/非表示の切り替え関数
function togglePasswordVisibility() {
  const passwordInput = document.getElementById('password');
  const eyeIcon = document.getElementById('eye-icon');

  if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      eyeIcon.classList.remove('fa-eye');
      eyeIcon.classList.add('fa-eye-slash');
  } else {
      passwordInput.type = 'password';
      eyeIcon.classList.remove('fa-eye-slash');
      eyeIcon.classList.add('fa-eye');
  }
}

document.getElementById('login-button').addEventListener('click', async function() {
  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('password').value.trim();
  const errorMessage = document.getElementById('error-message');
  const errorContainer = document.getElementById('error-message-container');
  const loadingSpinner = document.getElementById('loading-spinner');

  // エラーメッセージをリセット
  errorMessage.textContent = '';
  errorMessage.classList.add('hidden');

  // フォームの簡単なバリデーション
  if (!email || !senha) {
      errorMessage.textContent = 'メールとパスワードを入力してください。';
      errorMessage.classList.remove('hidden');
      return;
  }

  // ローディングスピナーを表示
  loadingSpinner.style.display = 'block';

  try {
      const response = await fetch('http://あなたのサーバー/login', { // サーバーのURLを正しく設定
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email_usuario: email, senha: senha })
      });

      if (response.ok) {
          const data = await response.json();
          const token = data.token;

          // JWTをローカルストレージに保存
          localStorage.setItem('token', token);

          // 成功メッセージを表示（必要に応じてリダイレクト）
          alert('ログイン成功');

          // ダッシュボードや別のページにリダイレクト
          window.location.href = 'dashboard.html'; // リダイレクト先を適切に設定
      } else {
          const errorText = await response.text();
          errorMessage.textContent = errorText || 'ログインに失敗しました。';
          errorMessage.classList.remove('hidden');
      }
  } catch (error) {
      console.error('エラー:', error);
      errorMessage.textContent = 'サーバーとの通信に問題が発生しました。';
      errorMessage.classList.remove('hidden');
  } finally {
      // ローディングスピナーを非表示
      loadingSpinner.style.display = 'none';
  }
});
