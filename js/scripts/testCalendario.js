function load() {
    const date = new Date();

    // mudar título do mês:
    if (nav !== 0) {
        date.setMonth(new Date().getMonth() + nav);
    }

    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    const daysMonth = new Date(year, month + 1, 0).getDate();
    const firstDayMonth = new Date(year, month, 1);

    const dateString = firstDayMonth.toLocaleDateString('pt-br', {
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    });

    const paddinDays = weekdays.indexOf(dateString.split(', ')[0]);

    // mostrar mês e ano:
    document.getElementById('monthDisplay').innerText = `${date.toLocaleDateString('pt-br', { month: 'long' })}, ${year}`;

    calendar.innerHTML = '';

    // Buscar eventos do banco de dados via backend
    fetch('http://localhost:3000/calendario/eventos')
        .then(response => response.json())
        .then(data => {
            events = data; // Atualizar o array `events` com os dados recebidos do backend

            // criando uma div com os dias:
            for (let i = 1; i <= paddinDays + daysMonth; i++) {
                const dayS = document.createElement('div');
                dayS.classList.add('day');

                const dayString = `${month + 1}/${i - paddinDays}/${year}`;

                // condicional para criar os dias de um mês:
                if (i > paddinDays) {
                    dayS.innerText = i - paddinDays;

                    const eventDay = events.find((event) => event.date === dayString);

                    if (i - paddinDays === day && nav === 0) {
                        dayS.id = 'currentDay';
                    }

                    if (eventDay) {
                        const eventDiv = document.createElement('div');
                        eventDiv.classList.add('event');
                        eventDiv.innerText = eventDay.title;
                        dayS.appendChild(eventDiv);
                    }

                    dayS.addEventListener('click', () => openModal(dayString));
                } else {
                    dayS.classList.add('padding');
                }

                calendar.appendChild(dayS);
            }
        })
        .catch(error => console.error('Erro ao buscar eventos:', error));
}

function saveEvent() {
    if (eventTitleInput.value) {
        eventTitleInput.classList.remove('error');

        const newEvent = {
            date: clicked,
            title: eventTitleInput.value
        };

        // Se estivermos editando um evento, modificamos a lógica aqui:
        if (isEditing) {
            const eventIndex = events.findIndex((event) => event.date === clicked);
            if (eventIndex !== -1) {
                events[eventIndex].title = newEvent.title;
                // Atualizar o evento existente no banco de dados
                fetch(`http://localhost:3000/calendario/eventos/${events[eventIndex].id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newEvent),
                })
                .then(() => {
                    closeModal();
                })
                .catch((error) => console.error('Erro ao editar evento:', error));
            }
        } else {
            // Adicionar novo evento ao banco de dados
            fetch('http://localhost:3000/calendario/eventos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newEvent),
            })
            .then(response => response.json())
            .then((data) => {
                events.push(data); // Adicionar o novo evento com ID retornado
                closeModal();
            })
            .catch(error => console.error('Erro ao adicionar evento:', error));
        }
    } else {
        eventTitleInput.classList.add('error');
    }
}

function deleteEvent() {
    const eventToDelete = events.find((event) => event.date === clicked);

    if (eventToDelete) {
        fetch(`http://localhost:3000/calendario/eventos/${eventToDelete.id}`, {
            method: 'DELETE',
        })
        .then(() => {
            events = events.filter((event) => event.date !== clicked);
            closeModal();
        })
        .catch(error => console.error('Erro ao deletar evento:', error));
    }
}

  app.get('/calendario/eventos', (req, res) => {
    const query = 'SELECT * FROM eventos';
    connection.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao buscar eventos' });
        }
        res.json(results); // Certifique-se de que os resultados estão no formato esperado
    });
});

// Exemplo para a rota POST
app.post('/calendario/eventos', (req, res) => {
    const { date, title } = req.body; // Extrair dados do corpo da requisição
    const query = 'INSERT INTO eventos (date, title) VALUES (?, ?)';
    connection.query(query, [date, title], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao adicionar evento' });
        }
        res.status(201).json({ id: results.insertId, date, title }); // Retorne o novo evento com seu ID
    });
});

// Exemplo para a rota PUT
app.put('/calendario/eventos/:id', (req, res) => {
    const { id } = req.params;
    const { date, title } = req.body; // Atualizando dados
    const query = 'UPDATE eventos SET date = ?, title = ? WHERE id = ?';
    connection.query(query, [date, title, id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao atualizar evento' });
        }
        res.json({ id, date, title }); // Retorne o evento atualizado
    });
});

// Exemplo para a rota DELETE
app.delete('/calendario/eventos/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM eventos WHERE id = ?';
    connection.query(query, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao deletar evento' });
        }
        res.sendStatus(204); // Retorna 204 No Content
    });
});
