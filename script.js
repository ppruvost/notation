const questionOptions = [
    "",
    "1A", "2A", "3A", "4A", "5A", "6A", "7A", "8A",
    "1B", "2B", "3B", "4B", "5B", "6B", "7B", "8B"
];

const data = [
    {
        comp: "S’approprier",
        items: [
            "Rechercher, extraire et organiser l’information.",
            "Traduire des informations, des codages.",
            "",
            "",
            ""
        ]
    },
    {
        comp: "Analyser / Raisonner",
        items: [
            "Émettre des conjectures, formuler des hypothèses.",
            "Proposer, choisir une méthode de résolution.",
            "Élaborer un algorithme.",
            "",
            ""
        ]
    },
    {
        comp: "Réaliser",
        items: [
            "Mettre en œuvre une méthode ou un protocole.",
            "Utiliser un modèle, représenter, calculer.",
            "Expérimenter, faire une simulation.",
            "",
            ""
        ]
    },
    {
        comp: "Valider",
        items: [
            "Exploiter et interpréter des résultats.",
            "Contrôler la vraisemblance d’une mesure.",
            "Valider un modèle ou une hypothèse.",
            "",
            ""
        ]
    },
    {
        comp: "Communiquer",
        items: [
            "Rendre compte d’un résultat.",
            "Expliquer une démarche.",
            "",
            "",
            ""
        ]
    }
];

const body = document.getElementById("tableBody");

data.forEach((bloc, ci) => {

    let first = true;

    bloc.items.forEach((capacite, i) => {

        let tr = document.createElement("tr");
        tr.id = `row-${ci}-${i}`;

        if (first) {
            tr.innerHTML += `
                <td class="comp" rowspan="5">${bloc.comp}</td>
            `;
            first = false;
        }

        tr.innerHTML += `
            <td class="cap">${capacite}</td>

            <td class="question-cell">
                <select id="q-${ci}-${i}" onchange="updateQuestionLists()">
                    ${questionOptions.map(q =>
                        `<option value="${q}">${q}</option>`
                    ).join("")}
                </select>
            </td>

            <td class="note-cell">
                <input type="radio" name="note-${ci}-${i}" value="0">
            </td>

            <td class="note-cell">
                <input type="radio" name="note-${ci}-${i}" value="1">
            </td>

            <td class="note-cell">
                <input type="radio" name="note-${ci}-${i}" value="2" checked>
            </td>

            <td>
                <input
                    type="checkbox"
                    id="val-${ci}-${i}"
                    checked
                    onchange="toggleRowState(${ci}, ${i})"
                >
            </td>

            ${i === 0
                ? `<td id="res-${ci}" rowspan="5">- / 4</td>`
                : ""
            }
        `;

        body.appendChild(tr);
    });
});

function updateQuestionLists() {

    let selectedValues = [];

    data.forEach((bloc, ci) => {
        bloc.items.forEach((_, i) => {

            const select = document.getElementById(`q-${ci}-${i}`);

            if (select.value !== "") {
                selectedValues.push(select.value);
            }
        });
    });

    data.forEach((bloc, ci) => {
        bloc.items.forEach((_, i) => {

            const select = document.getElementById(`q-${ci}-${i}`);
            const currentValue = select.value;

            Array.from(select.options).forEach(option => {

                if (option.value === "") return;

                option.disabled =
                    option.value !== currentValue &&
                    selectedValues.includes(option.value);
            });
        });
    });
}

function toggleRowState(ci, i) {

    const row = document.getElementById(`row-${ci}-${i}`);
    const checked = document.getElementById(`val-${ci}-${i}`).checked;

    const radios = document.getElementsByName(`note-${ci}-${i}`);
    const select = document.getElementById(`q-${ci}-${i}`);

    if (!checked) {

        row.classList.add("row-disabled");

        radios.forEach(r => {
            r.disabled = true;
        });

        select.disabled = true;

    } else {

        row.classList.remove("row-disabled");

        radios.forEach(r => {
            r.disabled = false;
        });

        select.disabled = false;
    }
}

function calculer() {

    let totalPoints = 0;
    let totalMax = 0;

    data.forEach((bloc, ci) => {

        let somme = 0;
        let nbValides = 0;

        bloc.items.forEach((_, i) => {

            const valide = document.getElementById(`val-${ci}-${i}`).checked;

            if (!valide) return;

            let valeur = 0;

            const radios = document.getElementsByName(`note-${ci}-${i}`);

            radios.forEach(r => {
                if (r.checked) {
                    valeur = parseFloat(r.value);
                }
            });

            somme += valeur;
            nbValides++;
        });

        let noteSur4 = 0;

        if (nbValides > 0) {

            let ratio = somme / (nbValides * 2);

            noteSur4 = (ratio * 3.25) + 0.45;

            if (noteSur4 < 0) noteSur4 = 0;
            if (noteSur4 > 4) noteSur4 = 4;

            noteSur4 = Math.round(noteSur4 * 2) / 2;

            totalPoints += noteSur4;
            totalMax += 4;
        }

        document.getElementById(`res-${ci}`).innerText =
            noteSur4.toFixed(1) + " / 4";
    });

    let total20 = 0;

    if (totalMax > 0) {

        total20 = (totalPoints / totalMax) * 20;

        total20 = total20 * 0.94 + 0.6;
    }

    if (total20 < 0) total20 = 0;
    if (total20 > 20) total20 = 20;

    total20 = Math.round(total20 * 2) / 2;

    document.getElementById("final").innerHTML =
        `Total sur 20 : <strong>${total20.toFixed(2)} / 20</strong>`;
}

data.forEach((bloc, ci) => {
    bloc.items.forEach((_, i) => {
        toggleRowState(ci, i);
    });
});

updateQuestionLists();
