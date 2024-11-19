// public/js/profjs/apricarFlatas.js
const apiUrl = 'http://localhost:5000'
// 初期化
document.addEventListener('DOMContentLoaded', () => {
  fetchTurmas()
  populateYearSelect()
})

// Turmas を取得しセレクトボックスを更新
function fetchTurmas() {
  fetch(`${apiUrl}/turmas`)
    .then(response => response.json())
    .then(data => {
      const turmaSelect = document.getElementById('turmaSelect')
      data.forEach(turma => {
        const option = document.createElement('option')
        option.value = turma.id_turma
        option.textContent = turma.nome_turma
        turmaSelect.appendChild(option)
      })
      turmaSelect.disabled = false
    })
    .catch(error => console.error('Error fetching Turmas:', error))
}

// 年を選択するためのセレクトボックスを初期化
function populateYearSelect() {
  const yearSelect = document.getElementById('yearSelect')
  const currentYear = new Date().getFullYear()
  for (let year = currentYear - 0; year <= currentYear + 2; year++) {
    const option = document.createElement('option')
    option.value = year
    option.textContent = year
    yearSelect.appendChild(option)
  }
  yearSelect.disabled = false
}

// Turmaが選択された時に関係のあるDisciplinasを取得しセレクトボックスを更新
document.getElementById('turmaSelect').addEventListener('change', event => {
  const turmaId = event.target.value
  fetchDisciplinasByTurma(turmaId)
})

function fetchDisciplinasByTurma(turmaId) {
  fetch(`${apiUrl}/turma_disciplinas/${turmaId}/disciplinas`)
    .then(response => response.json())
    .then(data => {
      const disciplinaSelect = document.getElementById('disciplinaSelect')
      disciplinaSelect.innerHTML = '<option value="" disabled selected>Escolha a Disciplina</option>'
      data.forEach(disciplina => {
        const option = document.createElement('option')
        option.value = disciplina.id_disciplina
        option.textContent = disciplina.nome_disciplina
        disciplinaSelect.appendChild(option)
      })
      disciplinaSelect.disabled = false
    })
    .catch(error => console.error('Error fetching Disciplinas:', error))
}

// 検索ボタンのクリックイベント
document.getElementById('searchButton').addEventListener('click', () => {
  const turmaId = document.getElementById('turmaSelect').value
  const disciplinaId = document.getElementById('disciplinaSelect').value
  const year = document.getElementById('yearSelect').value
  const semestre = document.getElementById('semestreSelect').value

  if (turmaId && disciplinaId && year && semestre) {
    fetchNotasFaltas(turmaId, disciplinaId, year, semestre)
  } else {
    alert('Selecione todos')
  }
})

// notas_faltasデータを取得し、ページに表示
function fetchNotasFaltas(turmaId, disciplinaId, year, semestre) {
  fetch(
    `${apiUrl}/notas_faltasApri?turmaId=${turmaId}&disciplinaId=${disciplinaId}&year=${year}&semestre=${semestre}`
  )
    .then(response => response.json())
    .then(data => {
      const resultContainer = document.getElementById('resultContainer');
      resultContainer.innerHTML = '';
      
      if (data.length > 0) {
        const table = document.createElement('table');
        table.className = 'table';

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        ['Selecionar', 'Foto do Aluno', 'Nome do Aluno', 'Faltas'].forEach(text => {
          const th = document.createElement('th');
          th.textContent = text;
          headerRow.appendChild(th);
        });
        
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        data.forEach(item => {
          const row = document.createElement('tr');

          const selectCell = document.createElement('td');
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.value = item.id_notas_faltas;
          selectCell.appendChild(checkbox);
          row.appendChild(selectCell);

          const photoCell = document.createElement('td');
          const photoImg = document.createElement('img');
          photoImg.src = item.foto ? `../../upload/${item.foto}` : './icons/semfoto.png';
          photoImg.alt = 'Sem Foto';
          photoImg.classList.add('img-alunoMini');
          photoCell.appendChild(photoImg);
          row.appendChild(photoCell);

          const nameCell = document.createElement('td');
          nameCell.textContent = item.nome_aluno;
          row.appendChild(nameCell);

          const faltasCell = document.createElement('td');
          faltasCell.textContent = item.faltas;
          row.appendChild(faltasCell);

          tbody.appendChild(row);
        });
        
        table.appendChild(tbody);
        resultContainer.appendChild(table);
        document.getElementById('applyFaltasButton').style.display = 'block';
      } else {
        resultContainer.textContent = 'Nenhum dado correspondente foi encontrado';
        document.getElementById('applyFaltasButton').style.display = 'none';
      }
    })
    .catch(error => console.error('Error fetching notas_faltas:', error));
}


// 「Aplicar Faltas」ボタンのクリックイベント
document.getElementById('applyFaltasButton').addEventListener('click', () => {
  const selectedCheckboxes = document.querySelectorAll('#resultContainer input[type="checkbox"]:checked')
  const ids = Array.from(selectedCheckboxes).map(checkbox => checkbox.value)
  /* const dataFalta = document.getElementById('dataFaltaInput').value */

  if (ids.length > 0 /* && dataFalta */) {
    applyFaltas(ids/* , dataFalta */)
    alert('Faltas aplicadas com sucesso'); // 変更が加えられたことを通知
    // 「Procurar」ボタンを「Renovar」に変更
    const searchButton = document.getElementById('searchButton');
    searchButton.innerText = 'Renovar';
    searchButton.classList.remove('btn-primary');
    searchButton.classList.add('btn-success');
  } else {
    alert('Está faltando dados')
  }
})

// チェックされた学生のIDを収集する関数
function getSelectedIds() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked'); // チェックされたチェックボックスを取得
  const ids = Array.from(checkboxes).map(checkbox => checkbox.value); // value 属性に ID が格納されていると仮定して取得
  console.log('Selected IDs:', ids); // デバッグ: 選択されたIDの配列を表示
  return ids;
}

async function applyFaltas() {
  try {
    const selectedIds = getSelectedIds(); // 選択されたIDを取得
    if (selectedIds.length === 0) {
      console.log('No students selected'); // チェック: 選択されていない場合のメッセージ
      return;
    }

    const response = await fetch(`${apiUrl}/notas_faltasApri/faltas`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: selectedIds }),
    });

    if (response.ok) {
      console.log('Faltas applied successfully');
      await fetchFaltasData(); // 最新のデータを取得して画面を更新
    } else {
      console.error('Failed to apply faltas');
    }
  } catch (error) {
    console.error('Error applying faltas:', error);
  }
}

// 画面にデータを再表示するための関数
async function fetchFaltasData() {
  try {
    const response = await fetch(`${apiUrl}/notas_faltasApri`);
    const data = await response.json();
    updateTable(data); // 取得したデータでテーブルを更新
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}