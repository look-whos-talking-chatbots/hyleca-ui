const botData = {
    dialogue_flows: [],
    dialogue_states: []
};

// LocalStorage'dan bot bilgilerini al
const botInfo = JSON.parse(localStorage.getItem('botInfo'));

if (botInfo) {
    document.getElementById('botName').textContent = botInfo.name + "-Bot";
    document.getElementById('botDescription').textContent = botInfo.description;
} else {
    document.getElementById('botName').textContent = 'Chat Bot';
    document.getElementById('botDescription').textContent = '';
}

document.addEventListener('DOMContentLoaded', (event) => {
    addEventListenersToStateButtons();
});

document.getElementById('createButton').addEventListener('click', () => {
    document.getElementById('createButton').style.display = 'none';
    document.getElementById('createBox').style.display = 'block';
    document.getElementById('addFlowButton').style.display = 'block';
    document.getElementById('addStateButton').style.display = 'block';
});

document.getElementById('addFlowButton').addEventListener('click', (event) => {
    event.preventDefault();
    document.getElementById('addFlowForm').classList.remove('hidden');
    document.getElementById('addFlowButton').style.display = 'none';
    document.getElementById('addStateButton').style.display = 'none';
});

document.getElementById('addStateButton').addEventListener('click', (event) => {
    event.preventDefault();
    document.getElementById('addStateForm').classList.remove('hidden');
    document.getElementById('addFlowButton').style.display = 'none';
    document.getElementById('addStateButton').style.display = 'none';
});

function addEventListenersToStateButtons() {
    document.getElementById('monologue-state-btn').addEventListener('click', showMonologueForm);
    document.getElementById('dialogue-state-btn').addEventListener('click', showDialogueForm);
}

function showMonologueForm() {
    document.getElementById('monologue-state-btn').classList.add('hidden');
    document.getElementById('dialogue-state-btn').classList.add('hidden');
    document.getElementById('add-monologue-state').classList.remove('hidden');
    document.getElementById('add-dialogue-state').classList.add('hidden');
}

function showDialogueForm() {
    document.getElementById('dialogue-state-btn').classList.add('hidden');
    document.getElementById('monologue-state-btn').classList.add('hidden');
    document.getElementById('add-dialogue-state').classList.remove('hidden');
    document.getElementById('add-monologue-state').classList.add('hidden');
}


function addFlow() {
    const flowId = document.getElementById('flowId').value;
    const flowTitle = document.getElementById('flowTitle').value;
    const flowDescription = document.getElementById('flowDescription').value;
    const flowConditions = document.getElementById('flowConditions').value.split(',').map(cond => cond.trim());

    const newFlow = {
        id: parseInt(flowId),
        title: flowTitle,
        description: flowDescription,
        conditions: flowConditions
    };

    botData.dialogue_flows.push(newFlow);
    console.log(botData);
    alert('New flow added!');
    displayFlows();

    document.getElementById('addFlowForm').reset();
    document.getElementById('addFlowForm').classList.add('hidden');
    document.getElementById('createBox').style.display = 'none';
    document.getElementById('createButton').style.display = 'block';
}

// State Features Operations


function showConditionInputs(button) {
    const form = button.parentElement.parentElement;
    if (form.id === "add-monologue-state") {
        document.querySelector('#add-monologue-state .featuresContainer').classList.add('hidden');
        document.querySelector('#add-monologue-state #conditionInputs').classList.remove('hidden');
    }else if (form.id === "add-dialogue-state"){
        document.querySelector('#add-dialogue-state .featuresContainer').classList.add('hidden');
        document.querySelector('#add-dialogue-state #conditionInputs').classList.remove('hidden');
    }
}

function showQuestionInputs(button) {
    const form = button.parentElement.parentElement;
    if (form.id === "add-monologue-state") {
        document.querySelector('#add-monologue-state .featuresContainer').classList.add('hidden');
        document.querySelector('#add-monologue-state #questionInputs').classList.remove('hidden');
    }else if (form.id === "add-dialogue-state"){
        document.querySelector('#add-dialogue-state .featuresContainer').classList.add('hidden');
        document.querySelector('#add-dialogue-state #questionInputs').classList.remove('hidden');
    }
}

function showCategoryInputs(button) {
    console.log("çalıştı")
    const form = button.parentElement.parentElement;
    if (form.id === "add-monologue-state") {
        document.querySelector('#add-monologue-state .featuresContainer').classList.add('hidden');
        document.querySelector('#add-monologue-state #categoryInputs').classList.remove('hidden');
    }else if (form.id === "add-dialogue-state"){
        document.querySelector('#add-dialogue-state .featuresContainer').classList.add('hidden');
        document.querySelector('#add-dialogue-state #categoryInputs').classList.remove('hidden');
    }
}

function showEntityInputs(button) {
    const form = button.parentElement.parentElement;
    if (form.id === "add-monologue-state") {
        document.querySelector('#add-monologue-state .featuresContainer').classList.add('hidden');
        document.querySelector('#add-monologue-state #entityInputs').classList.remove('hidden');
    }else if (form.id === "add-dialogue-state"){
        document.querySelector('#add-dialogue-state .featuresContainer').classList.add('hidden');
        document.querySelector('#add-dialogue-state #entityInputs').classList.remove('hidden');
    }
}

function showResponseInputs(button) {
    const form = button.parentElement.parentElement;
    if (form.id === "add-monologue-state") {
        document.querySelector('#add-monologue-state .featuresContainer').classList.add('hidden');
        document.querySelector('#add-monologue-state #responseInputs').classList.remove('hidden');
    }else if (form.id === "add-dialogue-state"){
        document.querySelector('#add-dialogue-state .featuresContainer').classList.add('hidden');
        document.querySelector('#add-dialogue-state #responseInputs').classList.remove('hidden');
    }
}

function showTriggerInputs(button) {
    const form = button.parentElement.parentElement;
    if (form.id === "add-monologue-state") {
        document.querySelector('#add-monologue-state .featuresContainer').classList.add('hidden');
        document.querySelector('#add-monologue-state #triggerInputs').classList.remove('hidden');
    }else if (form.id === "add-dialogue-state"){
        document.querySelector('#add-dialogue-state .featuresContainer').classList.add('hidden');
        document.querySelector('#add-dialogue-state #triggerInputs').classList.remove('hidden');
    }
}

function showMultipleChoiceInputs(button) {
    const form = button.parentElement.parentElement;
    if (form.id === "add-monologue-state") {
        document.querySelector('#add-monologue-state .featuresContainer').classList.add('hidden');
        document.querySelector('#add-monologue-state #multipleChoiceInputs').classList.remove('hidden');
    }else if (form.id === "add-dialogue-state"){
        document.querySelector('#add-dialogue-state .featuresContainer').classList.add('hidden');
        document.querySelector('#add-dialogue-state #multipleChoiceInputs').classList.remove('hidden');
    }
}

function showGeneratorInputs(button) {
    const form = button.parentElement.parentElement;
    if (form.id === "add-monologue-state") {
        document.querySelector('#add-monologue-state .featuresContainer').classList.add('hidden');
        document.querySelector('#add-monologue-state #generatorInputs').classList.remove('hidden');
    }else if (form.id === "add-dialogue-state"){
        document.querySelector('#add-dialogue-state .featuresContainer').classList.add('hidden');
        document.querySelector('#add-dialogue-state #generatorInputs').classList.remove('hidden');
    }
}

function showActionInputs(button) {
    const form = button.parentElement.parentElement;
    if (form.id === "add-monologue-state") {
        document.querySelector('#add-monologue-state .featuresContainer').classList.add('hidden');
        document.querySelector('#add-monologue-state #actionInputs').classList.remove('hidden');
    }else if (form.id === "add-dialogue-state"){
        document.querySelector('#add-dialogue-state .featuresContainer').classList.add('hidden');
        document.querySelector('#add-dialogue-state #actionInputs').classList.remove('hidden');
    }
}

function showResponseConditionInputs(button){
    const form = button.parentElement.parentElement.parentElement.parentElement;
    if (form.id === "add-monologue-state") {
        document.querySelector('#add-monologue-state #response-condition').classList.remove('hidden');
    }else if (form.id === "add-dialogue-state"){
        document.querySelector('#add-dialogue-state #response-condition').classList.remove('hidden');
    }
}

function showTextInput(button){
    const form = button.parentElement.parentElement.parentElement.parentElement;
    if (form.id === "add-monologue-state") {
        document.querySelector('#add-monologue-state #response-text').classList.remove('hidden');
    }else if (form.id === "add-dialogue-state"){
        document.querySelector('#add-dialogue-state #response-text').classList.remove('hidden');
    }
}

function showTriggersConditionInputs(button){
    const form = button.parentElement.parentElement.parentElement;
    if (form.id === "add-monologue-state") {
        document.querySelector('#add-monologue-state #triggers-condition').classList.remove('hidden');
    }else if (form.id === "add-dialogue-state"){
        document.querySelector('#add-dialogue-state #triggers-condition').classList.remove('hidden');
    }
}

function showTriggersTriggerInput(button){
    const form = button.parentElement.parentElement.parentElement;
    if (form.id === "add-monologue-state") {
        document.querySelector('#add-monologue-state #triggers-trigger').classList.remove('hidden');
    }else if (form.id === "add-dialogue-state"){
        document.querySelector('#add-dialogue-state #triggers-trigger').classList.remove('hidden');
    }
}

function showQuestionConditionInputs(button){
    const form = button.parentElement.parentElement.parentElement.parentElement;
    if (form.id === "add-monologue-state") {
        document.querySelector('#add-monologue-state #question-condition').classList.remove('hidden');
    }else if (form.id === "add-dialogue-state"){
        document.querySelector('#add-dialogue-state #question-condition').classList.remove('hidden');
    }
}

function showQuestionTextInput(button){
    const form = button.parentElement.parentElement.parentElement.parentElement;
    if (form.id === "add-monologue-state") {
        document.querySelector('#add-monologue-state #question-text').classList.remove('hidden');
    }else if (form.id === "add-dialogue-state"){
        document.querySelector('#add-dialogue-state #question-text').classList.remove('hidden');
    }

}

function addInput(button){
    const container = button.parentElement.parentElement;
    const div = document.createElement("div");
    div.className = "input-group";
    div.innerHTML = `
        <input type="text" class="entity-input" placeholder="input1">
        <input type="text" class="entity-input" placeholder="input2">
        <button type="button" onclick="addInput(this)">+</button>
        <button type="button" onclick="remove(this)">-</button>
    `;
    container.appendChild(div);
}

function addConditionInput(button) {
    const container = button.parentElement;
    const div = document.createElement("div");
    div.className = "input-group";
    div.innerHTML = `
        <input type="text" class="condition-input" placeholder="input1">
        <input type="text" class="condition-input" placeholder="operator">
        <input type="text" class="condition-input" placeholder="null">
        <button type="button" onclick="addConditionInput(this)">+</button>
        <button type="button" onclick="remove(this)">-</button>
    `;
    container.appendChild(div);
}

function addTextInput(button){
    const container = button.parentElement.parentElement;
    const div = document.createElement("div");
    div.className = "input-group";
    div.innerHTML = `
        <input type="text" class="question-text-input" placeholder="text">
        <button type="button" onclick="addTextInput(this)">+</button>
        <button type="button" onclick="remove(this)">-</button>
    `;
    container.appendChild(div);
}

function addTriggerInput(button){
    const container = button.parentElement;
    const div = document.createElement("div");
    div.className = "input-group";
    div.innerHTML = `
        <input type="text" class="trigger-state" placeholder="state">
        <input type="number" class="trigger-state-id" placeholder="state id">
        <button type="button" onclick="addTriggerInput(this)">+</button>
        <button type="button" onclick="remove(this)">-</button>
    `;
    container.appendChild(div);
}

function remove(button) {
    const div = button.parentElement;
    div.remove();
}

function saveConditions(button) {
    const inputs = document.querySelectorAll(".condition-input");
    const conditions = [];

    inputs.forEach((input, index) => {
        const value = input.value.trim();
        // Convert "null" string to null value
        const finalValue = (value === "null") ? null : value;

        // Check if all inputs are filled
        if (value !== '') {
            const inputType = index % 3; // Determine which input type (1st, 2nd, or 3rd)
            const groupIndex = Math.floor(index / 3); // Determine group index

            if (!conditions[groupIndex]) {
                conditions[groupIndex] = [];
            }

            conditions[groupIndex][inputType] = finalValue;
        }
    });

    console.log("Conditions:", conditions);

    // Reset UI if needed
    const form= button.parentElement.parentElement;
    if( form.id === "add-monologue-state"){
        document.querySelector('#add-monologue-state #conditionInputs').classList.add('hidden');
        document.querySelector('#add-monologue-state .featuresContainer').classList.remove('hidden');
    }else if (form.id === "add-dialogue-state"){
        document.querySelector('#add-dialogue-state #conditionInputs').classList.add('hidden');
        document.querySelector('#add-dialogue-state .featuresContainer').classList.remove('hidden');
    }
    

    return conditions;
}

function saveQuestions(button) {
    const conditionInputs = document.querySelectorAll('.question-condition-input');
    const textInputs = document.querySelectorAll('.question-text-input');
    const stateQuestions = [];

    let conditions = [];
    let texts = [];

    // Collect conditions
    conditionInputs.forEach((input, index) => {
        const value = input.value.trim();
        // Convert "null" string to null value
        const finalValue = (value === "null") ? null : value;

        // Check if all inputs are filled
        if (value !== '') {
            const inputType = index % 3; // Determine which input type (1st, 2nd, or 3rd)
            const groupIndex = Math.floor(index / 3); // Determine group index

            if (!conditions[groupIndex]) {
                conditions[groupIndex] = [];
            }
            conditions[groupIndex][inputType] = finalValue;
        }
    });
    // Collect texts
    textInputs.forEach(input => {
        if (input.value !== '') {
            texts.push(input.value);
        }
    });

    // Add conditions and texts to stateQuestions
    if (conditions.length > 0 || texts.length > 0) {
        stateQuestions.push({ conditions: conditions, text: texts });
    }

    console.log(stateQuestions);
    // Reset UI if needed

    const form= button.parentElement.parentElement;
    if( form.id === "add-monologue-state"){
        document.querySelector('#add-monologue-state #questionInputs').classList.add('hidden');
        document.querySelector('#add-monologue-state .featuresContainer').classList.remove('hidden');
    }else if (form.id === "add-dialogue-state"){
        document.querySelector('#add-dialogue-state #questionInputs').classList.add('hidden');
        document.querySelector('#add-dialogue-state .featuresContainer').classList.remove('hidden');
    }

    return stateQuestions;
}

function saveCategories(button) {
    const inputs = document.querySelectorAll(".category-input");
    const categories = [];
    for (let i = 0; i < inputs.length; i += 2) {
        const input1 = inputs[i].value;
        const input2 = inputs[i + 1].value;
        if (input1 !== '' && input2 !== '') {
        categories.push([input1, input2]);
        }
    }
    console.log("Categories:", categories);
     // Reset UI if needed
     const form= button.parentElement.parentElement;
    if( form.id === "add-monologue-state"){
        document.querySelector('#add-monologue-state #categoryInputs').classList.add('hidden');
        document.querySelector('#add-monologue-state .featuresContainer').classList.remove('hidden');
    }else if (form.id === "add-dialogue-state"){
        document.querySelector('#add-dialogue-state #categoryInputs').classList.add('hidden');
        document.querySelector('#add-dialogue-state .featuresContainer').classList.remove('hidden');
    }
return categories;
}

function saveEntities(button) {
    const inputs = document.querySelectorAll(".entity-input");
    const entities = [];
    for (let i = 0; i < inputs.length; i += 2) {
        const input1 = inputs[i].value;
        const input2 = inputs[i + 1].value;
        if (input1 !== '' && input2 !== '') {
        entities.push([input1, input2]);
        }
    }
    console.log("Entities:", entities);
     // Reset UI if needed
    const form= button.parentElement.parentElement;
    if( form.id === "add-monologue-state"){
        document.querySelector('#add-monologue-state #entityInputs').classList.add('hidden');
        document.querySelector('#add-monologue-state .featuresContainer').classList.remove('hidden');
    }else if (form.id === "add-dialogue-state"){
        document.querySelector('#add-dialogue-state #entityInputs').classList.add('hidden');
        document.querySelector('#add-dialogue-state .featuresContainer').classList.remove('hidden');
    }
return entities;
}

function saveResponses(button) {
    const conditionInputs = document.querySelectorAll('.response-condition-input');
    const textInputs = document.querySelectorAll('.response-text-input');
    const stateResponses = [];

    let conditions = [];
    let texts = [];

    // Collect conditions
    conditionInputs.forEach((input, index) => {
        const value = input.value.trim();
        // Convert "null" string to null value
        const finalValue = (value === "null") ? null : value;

        // Check if all inputs are filled
        if (value !== '') {
            const inputType = index % 3; // Determine which input type (1st, 2nd, or 3rd)
            const groupIndex = Math.floor(index / 3); // Determine group index

            if (!conditions[groupIndex]) {
                conditions[groupIndex] = [];
            }

            conditions[groupIndex][inputType] = finalValue;
        }
    });
    // Collect texts
    textInputs.forEach(input => {
        if (input.value !== '') {
            texts.push(input.value);
        }
    });

    // Add conditions and texts to stateResponses
    if (conditions.length > 0 || texts.length > 0) {
        stateResponses.push({ conditions: conditions, text: texts });
    }

    console.log(stateResponses);
    // Reset UI if needed
    const form= button.parentElement.parentElement;
    if( form.id === "add-monologue-state"){
        document.querySelector('#add-monologue-state #responseInputs').classList.add('hidden');
        document.querySelector('#add-monologue-state .featuresContainer').classList.remove('hidden');
    }else if (form.id === "add-dialogue-state"){
        document.querySelector('#add-dialogue-state #responseInputs').classList.add('hidden');
        document.querySelector('#add-dialogue-state .featuresContainer').classList.remove('hidden');
    }
    return stateResponses;
}

function saveTriggers(button) {
    const conditionInputs = document.querySelectorAll('.triggers-condition-input');
    const triggerStateInputs = document.querySelectorAll('.trigger-state');
    const triggerStateIdInputs = document.querySelectorAll('.trigger-state-id');
    
    const triggers = [];

    // Collect conditions
    const conditions = [];
    conditionInputs.forEach((input, index) => {
        const value = input.value.trim();
        // Convert "null" string to null value
        const finalValue = (value === "null") ? null : value;

        // Check if all inputs are filled
        if (value !== '') {
            const inputType = index % 3; // Determine which input type (1st, 2nd, or 3rd)
            const groupIndex = Math.floor(index / 3); // Determine group index

            if (!conditions[groupIndex]) {
                conditions[groupIndex] = [];
            }

            conditions[groupIndex][inputType] = finalValue;
        }
    });

    // Collect triggers
    for (let i = 0; i < triggerStateInputs.length; i++) {
        const state = triggerStateInputs[i].value;
        const stateId = parseInt(triggerStateIdInputs[i].value);
        if (state !== '' && !isNaN(stateId)) {
            triggers.push({
                conditions: conditions,
                trigger: [state, stateId]
            });
        }
    }
    console.log("Triggers:", triggers);

    // Reset UI if needed
    const form= button.parentElement.parentElement;
    if( form.id === "add-monologue-state"){
        document.querySelector('#add-monologue-state #triggerInputs').classList.add('hidden');
        document.querySelector('#add-monologue-state .featuresContainer').classList.remove('hidden');
    }else if (form.id === "add-dialogue-state"){
        document.querySelector('#add-dialogue-state #triggerInputs').classList.add('hidden');
        document.querySelector('#add-dialogue-state .featuresContainer').classList.remove('hidden');
    }

    return triggers;
}

function saveMultipleChoice(button) {
    const inputs = document.querySelectorAll(".multipleChoice-input");
    const multipleChoices = [];
    for (let i = 0; i < inputs.length; i += 2) {
        const input1 = inputs[i].value;
        const input2 = inputs[i + 1].value;
        if (input1 !== '' && input2 !== '') {
        multipleChoices.push([input1, input2]);
        }
    }
    console.log("MultipleChoices:", multipleChoices);
     // Reset UI if needed
     const form= button.parentElement.parentElement;
    if( form.id === "add-monologue-state"){
        document.querySelector('#add-monologue-state #multipleChoiceInputs').classList.add('hidden');
        document.querySelector('#add-monologue-state .featuresContainer').classList.remove('hidden');
    }else if (form.id === "add-dialogue-state"){
        document.querySelector('#add-dialogue-state #multipleChoiceInputs').classList.add('hidden');
        document.querySelector('#add-dialogue-state .featuresContainer').classList.remove('hidden');
    }
return multipleChoices;
}

function saveGenerators(button) {
    const inputs = document.querySelectorAll(".generator-input");
    const generators = [];
    for (let i = 0; i < inputs.length; i += 2) {
        const input1 = inputs[i].value;
        const input2 = inputs[i + 1].value;
        if (input1 !== '' && input2 !== '') {
        generators.push([input1, input2]);
        }
    }
    console.log("Generators:", generators);
     // Reset UI if needed
     const form= button.parentElement.parentElement;
     if( form.id === "add-monologue-state"){
         document.querySelector('#add-monologue-state #generatorInputs').classList.add('hidden');
         document.querySelector('#add-monologue-state .featuresContainer').classList.remove('hidden');
     }else if (form.id === "add-dialogue-state"){
         document.querySelector('#add-dialogue-state #generatorInputs').classList.add('hidden');
         document.querySelector('#add-dialogue-state .featuresContainer').classList.remove('hidden');
     }
return generators;
}

function saveActions(button) {
    const inputs = document.querySelectorAll(".action-input");
    const actions = [];
    for (let i = 0; i < inputs.length; i += 2) {
        const input1 = inputs[i].value;
        const input2 = inputs[i + 1].value;
        if (input1 !== '' && input2 !== '') {
        actions.push([input1, input2]);
        }
    }
    console.log("Actions:", actions);
     // Reset UI if needed
     const form= button.parentElement.parentElement;
     if( form.id === "add-monologue-state"){
         document.querySelector('#add-monologue-state #actionInputs').classList.add('hidden');
         document.querySelector('#add-monologue-state .featuresContainer').classList.remove('hidden');
     }else if (form.id === "add-dialogue-state"){
         document.querySelector('#add-dialogue-state #actionInputs').classList.add('hidden');
         document.querySelector('#add-dialogue-state .featuresContainer').classList.remove('hidden');
     }
return actions;

}


function addState(stateType) {
    const stateId = document.getElementById('state-id').value;

    // Conditions, Questions, Categories, Entities, Responses, Triggers, MultipleChoice, Generators, Actions
    const stateConditions = saveConditions();
    const stateQuestions = saveQuestions();
    const stateCategories = saveCategories();
    const stateEntities = saveEntities();
    const stateResponses = saveResponses();
    const stateTriggers = saveTriggers();
    const stateMultipleChoice = saveMultipleChoice();
    const stateGenerators = saveGenerators();
    const stateActions = saveActions();
   
    const newState = {
        id: parseInt(stateId),
        type: stateType,
        conditions: stateConditions,
        questions: stateQuestions,
        categories: stateCategories,
        entities: stateEntities,
        responses: stateResponses,
        triggers: stateTriggers,
        multipleChoices: stateMultipleChoice,
        generators: stateGenerators,
        actions: stateActions
    };

    botData.dialogue_states.push(newState);
    console.log(newState);
    alert('New state added!');
    displayStates();

    document.getElementById('addStateForm').reset();
    document.getElementById('addStateForm').classList.add('hidden');
    document.getElementById('createBox').style.display = 'none';
    document.getElementById('createButton').style.display = 'block';

    // Convert stateResponses to JSON format
    const jsonContent = JSON.stringify(newState, null, 2);

    // Create a Blob object from the JSON content
    const blob = new Blob([jsonContent], { type: 'application/json' });

    // Create a temporary link element
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = 'responses.json';
    
    // Append the link to the DOM and click it programmatically
    document.body.appendChild(downloadLink);
    downloadLink.click();

}


function displayFlows() {
    const flowDiv = document.querySelector('.flow-section');
    if (flowDiv) {
        flowDiv.innerHTML = '<h2>Flows</h2>'; // Clear previous flows
    } else {
        const newFlowDiv = document.createElement('div');
        newFlowDiv.classList.add('flow-section');
        newFlowDiv.innerHTML = '<h2>Flows</h2>';
        document.getElementById('chat').appendChild(newFlowDiv);
    }

    botData.dialogue_flows.forEach(flow => {
        const singleFlowDiv = document.createElement('div');
        singleFlowDiv.classList.add('flow');
        singleFlowDiv.innerHTML = `
            <h3>Flow ID: ${flow.id}</h3>
            <p>Title: ${flow.title}</p>
            <p>Description: ${flow.description}</p>
            <p>Conditions: ${flow.conditions.join(', ')}</p>
        `;
        document.querySelector('.flow-section').appendChild(singleFlowDiv);
    });
}

function displayStates() {
    const stateDiv = document.querySelector('.state-section');
    if (stateDiv) {
        stateDiv.innerHTML = '<h2>States</h2>'; // Önceki state'leri temizle
    } else {
        const newStateDiv = document.createElement('div');
        newStateDiv.classList.add('state-section');
        newStateDiv.innerHTML = '<h2>States</h2>';
        document.getElementById('chat').appendChild(newStateDiv);
    }

    // Bot data içindeki her bir state için döngü oluştur
    botData.dialogue_states.forEach(state => {
        const singleStateDiv = document.createElement('div');
        singleStateDiv.classList.add('state');
        singleStateDiv.innerHTML = `
            <h4>State ID: ${state.id}</h4>
            <p>Type: ${state.type}</p>
        `;
        
        // Conditions gösterimi
        
        if (state.conditions.length > 0) {
            singleStateDiv.innerHTML += `
                <h5>Conditions:</h5>
                <ul>
                    ${state.conditions.map(c => `<li>${c[0]}: ${c[1]}</li>`).join('')}
                </ul>
            `;
        }

        // Questions gösterimi
        if (state.questions.length > 0) {
            singleStateDiv.innerHTML += `
                <h5>Questions:</h5>
                <ul>
                    ${state.questions.map(q => `<li>${q[0]}: ${q[1]}</li>`).join('')}
                </ul>
            `;
        }

        // Categories gösterimi
        if (state.categories.length > 0) {
            singleStateDiv.innerHTML += `
                <h5>Categories:</h5>
                <ul>
                    ${state.categories.map(cat => `<li>${cat[0]}: ${cat[1]}</li>`).join('')}
                </ul>
            `;
        }

        // Entities gösterimi
        if (state.entities.length > 0) {
            singleStateDiv.innerHTML += `
                <h5>Entities:</h5>
                <ul>
                    ${state.entities.map(ent => `<li>${ent[0]}: ${ent[1]}</li>`).join('')}
                </ul>
            `;
        }

        // Responses gösterimi
        if (state.responses.length > 0) {
            singleStateDiv.innerHTML += `
                <h5>Responses:</h5>
                <ul>
                    ${state.responses.map(resp => `<li>${resp[0]}: ${resp[1]}</li>`).join('')}
                </ul>
            `;
        }

        // Triggers gösterimi
        if (state.triggers.length > 0) {
            singleStateDiv.innerHTML += `
                <h5>Triggers:</h5>
                <ul>
                    ${state.triggers.map(trigger => `<li>${trigger[0]}: ${trigger[1]}</li>`).join('')}
                </ul>
            `;
        }

        // Multiple Choice gösterimi
        if (state.multipleChoices.length > 0) {
            singleStateDiv.innerHTML += `
                <h5>Multiple Choice:</h5>
                <ul>
                    ${state.multipleChoices.map(mc => `<li>${mc[0]}: ${mc[1]}</li>`).join('')}
                </ul>
            `;
        }

        // Generators gösterimi
        if (state.generators.length > 0) {
            singleStateDiv.innerHTML += `
                <h5>Generators:</h5>
                <ul>
                    ${state.generators.map(gen => `<li>${gen[0]}: ${gen[1]}</li>`).join('')}
                </ul>
            `;
        }

        // Actions gösterimi
        if (state.actions.length > 0) {
            singleStateDiv.innerHTML += `
                <h5>Actions:</h5>
                <ul>
                    ${state.actions.map(action => `<li>${action[0]}: ${action[1]}</li>`).join('')}
                </ul>
            `;
        }

        document.querySelector('.state-section').appendChild(singleStateDiv);
    });
}