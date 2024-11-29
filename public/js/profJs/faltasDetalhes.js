// faltasDetalhes.js
const apiUrlNota = '/notas';
const apiUrlAluno = '/alunos';

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const alunoId = urlParams.get('id_aluno');
  const id_disciplina = urlParams.get('id_disciplina');
  const idNotasFaltas = urlParams.get('idNotasFaltas');
  const year = urlParams.get('year');
  const semestre = urlParams.get('semestre');

  // Aluno情報を取得
  fetchAlunoInfo(alunoId);
  
  // Notas情報を取得
  fetchNotaInfo(idNotasFaltas);

  // Notas情報を取得
  fetchNotaDetalhesInfo(alunoId, id_disciplina);

  // フォームの送信イベント
  /* document.getElementById('aluno-list').addEventListener('submit', (event) => {
    event.preventDefault();
    updateNota(idNotasFaltas, alunoId, id_disciplina, year, semestre);
  }); */
});

function fetchAlunoInfo(alunoId) {
  fetch(`${apiUrlAluno}/${alunoId}`)
    .then(response => response.json())
    .then(data => {
      if (data) {
        // データカードに生徒情報を挿入
        document.getElementById('card-nomeAluno').textContent = data.nome_usuario || 'Não disponível';
        document.getElementById('card-matriculaAluno').textContent = formatDate(data.data_matricula) || '-';
      } else {
        console.error('No Aluno data found.');
      }
    })
    .catch(error => console.error('Error fetching Aluno:', error));
}

function fetchNotaInfo(id_notas_faltas) {
  fetch(`/notasByid_notas_faltas/${id_notas_faltas}`)
    .then(response => response.json())
    .then(data => {
      if (data && data.length > 0) {
        const notaInfo = data[0];
        // データカードにNotas情報を挿入
        document.getElementById('card-disciplina').textContent = notaInfo.nome_disciplina || '0';
        document.getElementById('card-n1Aluno').textContent = notaInfo.N1 || '-';
        document.getElementById('card-apAluno').textContent = notaInfo.AP || '-';
        document.getElementById('card-aiAluno').textContent = notaInfo.AI || '-';
        document.getElementById('card-anoAluno').textContent = notaInfo.ano_academico || '-';
        document.getElementById('card-semestreAluno').textContent = notaInfo.semestre || '-';

        // カードを表示
        document.getElementById('data-card-container').style.display = 'block';
      } else {
        console.error('No Nota data found.');
      }
    })
    .catch(error => console.error('Error fetching Nota:', error));
}

function fetchNotaDetalhesInfo(id_aluno, id_disciplina) {
  fetch(`/notasByid_notas_faltas/${id_aluno}/${id_disciplina}`)
    .then(response => response.json())
    .then(data => {
      const listaContainer = document.getElementById('notaList'); // リスト表示用のコンテナを指定
      listaContainer.innerHTML = ''; // 既存のリストをクリア

      if (data && data.length > 0) {
        data.forEach(notaInfo => {
          const listItem = document.createElement('li');

          // 欠席日のテキスト
          const text = document.createTextNode(`Data: ${formatDate(notaInfo.data_falta)}`);

          // 削除ボタン
          const deleteButton = document.createElement('button');
          deleteButton.textContent = '削除';
          deleteButton.className = 'btn btn-danger btn-lg shadow-sm '; // Bootstrapのスタイルを追加
          deleteButton.innerHTML = '<i class="bi bi-trash"></i> 削除'; // アイコンを追加
          deleteButton.addEventListener('click', () => deleteFalta(notaInfo.id_faltas_detalhes));

          listItem.appendChild(text);
          listItem.appendChild(deleteButton);
          listaContainer.appendChild(listItem);
        });
      } else {
        // 欠席がない場合に「Sem falta」を表示
        const noFaltaMessage = document.createElement('li');
        noFaltaMessage.textContent = 'Sem falta';
        listaContainer.appendChild(noFaltaMessage);
      }
    })
    .catch(error => console.error('Error fetching Nota:', error));
}


// 削除ボタンがクリックされたときに呼び出す関数
function deleteFalta(id_faltas_detalhes) {
  fetch(`/delete/${id_faltas_detalhes}`, { method: 'DELETE' })
    .then(response => response.json())
    .then(result => {
      if (result.message) {
        console.log(result.message);
        fetchNotaInfo(id_notas_faltas); // リストを再取得して更新
      } else {
        console.error(result.error);
      }
    })
    .catch(error => console.error('Error deleting falta:', error));
}


// 日付のフォーマット関数
function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}