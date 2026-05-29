const questionOptions = [
    "",
    "1A", "2A", "3A", "4A", "5A", "6A", "7A", "8A",
    "1B", "2B", "3B", "4B", "5B", "6B", "7B", "8B",
    "1C", "2C", "3C", "4C", "5C", "6C", "7C", "8C"
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
                ? `<td id="res-${ci}" rowspan="5">- / 2</td>`
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

        let noteSur2 = 0;

        if (nbValides > 0) {

            // ratio entre 0 et 1
            let ratio = somme / (nbValides * 2);

            // conversion sur 2 points
            noteSur2 = ratio * 2;

            // sécurité bornes
            if (noteSur2 < 0) noteSur2 = 0;
            if (noteSur2 > 2) noteSur2 = 2;

            // arrondi au quart de point :
            // 0.00 / 0.25 / 0.50 / 0.75
            noteSur2 = Math.round(noteSur2 * 4) / 4;

            totalPoints += noteSur2;
            totalMax += 2;
        }

        document.getElementById(`res-${ci}`).innerText =
            noteSur2.toFixed(2) + " / 2";
    });

    let total10 = 0;

    if (totalMax > 0) {

        // conversion du total sur 10
        total10 = (totalPoints / totalMax) * 10;
    }

    // bornes de sécurité
    if (total10 < 0) total10 = 0;
    if (total10 > 10) total10 = 10;

    // arrondi au quart de point :
    // 0.00 / 0.25 / 0.50 / 0.75
    total10 = Math.round(total10 * 4) / 4;

    document.getElementById("final").innerHTML =
        `Total : <strong>${total10.toFixed(2)} / 10</strong>`;
}

data.forEach((bloc, ci) => {
    bloc.items.forEach((_, i) => {
        toggleRowState(ci, i);
    });
});

updateQuestionLists();
