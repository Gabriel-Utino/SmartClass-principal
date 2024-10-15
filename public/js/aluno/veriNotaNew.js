// public/js/notas.js

const apiUrlNotasFaltas = 'http://localhost:5000/notas_faltas';
const apiUrlDisciplina = 'http://localhost:5000/disciplinas';
const apiUrlAluno = 'http://localhost:5000/alunos';

// ユーザー情報からid_alunoを取得
const id_aluno = user.id_aluno; // `user.id_aluno`がセッションで正しく設定されていることを確認

function populateAnoSelect(data_matricula) {
    const selectAno = document.getElementById('selectAno');
    const currentYear = new Date().getFullYear(); // 現在の年を取得
    const startYear = new Date(data_matricula).getFullYear();
    // 選択肢を生成
    for (let year = startYear; year <= currentYear; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.text = year;
        selectAno.appendChild(option);
    }
}

function displayNota(notas) {
    const notaList = document.getElementById('notaList');
    notaList.innerHTML = '';
    notas.forEach(nota => {
        // Disciplinaの情報を取得
        fetch(`${apiUrlDisciplina}/${nota.id_disciplina}`, { credentials: 'include' }) // CORSと認証を考慮
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(disciplina => {
                const notaElement = document.createElement('tr');
                notaElement.innerHTML = `
                    <td>${disciplina.disciplina}</td>
                    <td>${nota.n1 !== null ? nota.n1 : 0}</td>
                    <td>${nota.AI !== null ? nota.AI : 0}</td>
                    <td>${nota.AP !== null ? nota.AP : 0}</td>
                    <td>${nota.academic_year}</td>
                    <td>${nota.semestre}</td>
                `;
                notaList.appendChild(notaElement);
            })
            .catch(error => console.error('Erro:', error));
    });
}

function getNotasByAluno() {
    fetch(`${apiUrlAluno}/${id_aluno}/notas_faltas`, { credentials: 'include' }) // CORSと認証を考慮
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const notas = data;
            displayNota(notas);
            // data_matriculaを取得して年選択肢をpopulate
            fetch(`${apiUrlAluno}/${id_aluno}`, { credentials: 'include' })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(aluno => {
                    populateAnoSelect(aluno.data_matricula);
                })
                .catch(error => console.error('Erro:', error));
        })
        .catch(error => console.error('Erro:', error));
}

function filterNotas() {
    const ano = document.getElementById('selectAno').value;
    const semestre = document.getElementById('selectSemestre').value;
    const id_aluno = user.id_aluno; // `user.id_aluno`を使用

    fetch(`${apiUrlAluno}/${id_aluno}/notas_faltas`, { credentials: 'include' })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const filteredNotas = data.filter(nota => nota.academic_year == ano && nota.semestre == semestre);
            displayNota(filteredNotas);
        })
        .catch(error => console.error('filter Erro:', error));
}

document.getElementById('filterButton').addEventListener('click', filterNotas);

// 日付のフォーマット関数
function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

getNotasByAluno();
