const botInfo = JSON.parse(localStorage.getItem('botInfo'));

let botData = {
    version: botInfo.version,
    name: botInfo.name,
    description: botInfo.description,
    language: botInfo.language,
    slot_fillers: {
        static_slots: {},
        retrieval_slots: {}
    },
    dialogue_flows: []
};

document.getElementById('downloadIcon').addEventListener('click', function() {
    const jsonContent = JSON.stringify(botData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = 'botData.json';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
});


document.addEventListener('DOMContentLoaded', (event) => {

    const savedBotData = localStorage.getItem('botData');
    if (savedBotData) {
        botData = JSON.parse(savedBotData);
        loadFlows();
    }
    // Set initial bot name and description
    document.getElementById('botName').textContent = botData.name + "-Bot";
    document.getElementById('botDescription').textContent = botData.description;

    // Add event listeners
    document.getElementById('addFlowButton').addEventListener('click', function() {
        console.log('Add Flow Button Clicked');
        var modal = document.getElementById('modalOverlayFlow');
        modal.style.display = 'flex';
    });

    const addStateButton = document.getElementById('addStateButton');
    if (addStateButton) {
        addStateButton.addEventListener('click', function() {
            console.log('Add State Button Clicked');
            var modalState = document.getElementById('modalOverlayState');
            modalState.style.display = 'flex';
        });
    } else {
        console.error('addStateButton not found.');
    }

    addEventListenersToStateButtons();
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

    const newFlow = {
        id: parseInt(flowId),
        title: flowTitle,
        description: flowDescription,
        conditions: saveConditionFlow(),
        states: []
    };

    botData.dialogue_flows.push(newFlow);
    saveBotData();

    const flowContainer = document.getElementById('flowsContainer');
    const flowElement = document.createElement('div');
    flowElement.className = 'flow';
    flowElement.innerHTML = `
        <div class="flow-header">Flow ID: ${flowId}</div>
        <button class="toggle-states-button"></button>
    `;
    flowContainer.appendChild(flowElement);
    const statesContainer=document.createElement('div');
    statesContainer.id=`'statesContainer-${flowId}'`;
    statesContainer.className='states-container';

    flowContainer.appendChild(statesContainer);

    const addStateButton = document.createElement('button');
    addStateButton.id = "addStateButton"; 
    addStateButton.textContent = "Add State";
    statesContainer.appendChild(addStateButton);

    const hrElement = document.createElement('hr');
    flowContainer.appendChild(hrElement);

    console.log(botData);
    alert('New flow added!');

    document.getElementById('addFlowForm').reset();
    document.getElementById('modalOverlayFlow').style.display = 'none';

    // addStateButton'a event listener ekleme
    addStateButton.addEventListener('click', function() {
        console.log('Add State Button Clicked');
        var modalState = document.getElementById('modalOverlayState');
        modalState.style.display = 'flex';

        const flowIdInputMonologue = document.querySelectorAll('.state-flow-id-monologue');
        const flowIdInputDialogue = document.querySelectorAll('.state-flow-id-dialogue');
        
        if (flowIdInputMonologue.length > 0) {
            flowIdInputMonologue.forEach(input1 => {
                input1.value = flowId;  
            });
        } else {
            console.error('No elements with class "state-flow-id-monologue" found.');
        }
        
        if (flowIdInputDialogue.length > 0) {
            flowIdInputDialogue.forEach(input2 => {
                input2.value = flowId;  
            });
        } else {
            console.error('No elements with class "state-flow-id-dialogue" found.');
        }
        
        });

    const toggleStatesButton = flowElement.querySelector('.toggle-states-button');
        toggleStatesButton.style.backgroundImage = 'url("../images/visible.png")'; 

        toggleStatesButton.addEventListener('click', function () {
            if (statesContainer.style.display === 'flex' || statesContainer.style.display === '') {
                statesContainer.style.display = 'none';
                toggleStatesButton.style.backgroundImage = 'url("../images/hidden.png")';
            } else {
                statesContainer.style.display = 'flex';
                toggleStatesButton.style.backgroundImage = 'url("../images/visible.png")';
            }
        });
}

function addState(stateType) {
    let stateId, stateFlowId;
    if(stateType === "monologue"){
        stateId = document.querySelector('#add-monologue-state #state-id').value;
        stateFlowId = document.querySelector('#add-monologue-state #state-flow-id').value;
    }
    else if(stateType === "dialogue"){
        stateId = document.querySelector('#add-dialogue-state #state-id').value;
        stateFlowId = document.querySelector('#add-dialogue-state #state-flow-id').value;
    }
    
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

    // ilgili flow'a state'i ekliyoruz
    const targetFlow = botData.dialogue_flows.find(flow => flow.id === parseInt(stateFlowId));
    if (targetFlow) {
        targetFlow.states.push(newState);
        saveBotData();
    } else {
            console.error("Target Flow not found for ID:", stateFlowId);
            return;
        }
    const stateContainer = document.getElementById(`'statesContainer-${stateFlowId}'`);
    if (!stateContainer) {
        console.error(`State container with ID 'statesContainer-${stateFlowId}' not found.`);
        return;
    }
    const stateElement = document.createElement('div');
    stateElement.className = 'state';
    stateElement.innerHTML = `<div class="state-header">State ID: ${stateId}</div>
                              <div class="state-header">State Type: ${stateType}</div>`;
    stateContainer.appendChild(stateElement);
    
    // Ensure the "Add State" button is always at the bottom
    const addStateButton = stateContainer.querySelector('#addStateButton');
    if (addStateButton) {
        stateContainer.insertBefore(stateElement, addStateButton);
    } else {
        stateContainer.appendChild(stateElement);
    }


    console.log(botData);
    alert('New state added!');

    document.getElementById('addStateForm').reset();
    document.getElementById('modalOverlayState').style.display = 'none';

    document.getElementById('add-monologue-state').classList.add('hidden');
    document.getElementById('add-dialogue-state').classList.add('hidden');
    document.getElementById('monologue-state-btn').classList.remove('hidden');
    document.getElementById('dialogue-state-btn').classList.remove('hidden');
}


function saveConditionFlow() {
    const inputs = document.querySelectorAll(".flow-condition-input");
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
    return conditions;
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
        <input type="text" class="flow-condition-input" placeholder="input1">
        <input type="text" class="flow-condition-input" placeholder="operator">
        <input type="text" class="flow-condition-input" placeholder="null">
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

function resetInput(button) {
    const form = button.parentElement.parentElement;
    const inputTypeId = button.parentElement.id;

    if (form.id === "add-monologue-state") {
        const targetElement = document.querySelector(`#${form.id} #${inputTypeId}`);
        if (targetElement) {
            targetElement.classList.add('hidden');
        }
        document.querySelector('#add-monologue-state .featuresContainer').classList.remove('hidden');
    } else if (form.id === "add-dialogue-state") {
        const targetElement = document.querySelector(`#${form.id} #${inputTypeId}`);
        if (targetElement) {
            targetElement.classList.add('hidden');
        }
        document.querySelector('#add-dialogue-state .featuresContainer').classList.remove('hidden');
    }
}
function handleButtonCondition(button) {
    saveConditions();
    resetInput(button);
}
function handleButtonQuestion(button){
    saveQuestions();
    resetInput(button);
}
function handleButtonCategory(button){
    saveCategories();
    resetInput(button);
}
function handleButtonEntity(button){
    saveEntities();
    resetInput(button);
}
function handleButtonResponse(button){
    saveResponses();
    resetInput(button);
}
function handleButtonTrigger(button){
    saveTriggers();
    resetInput(button);
}
function handleButtonMultiple(button){
    saveMultipleChoice();
    resetInput(button);
}
function handleButtonGenerator(button){
    saveGenerators();
    resetInput(button);
}
function handleButtonAction(button){
    saveActions();
    resetInput(button);
}

function saveConditions() {
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

    

    return conditions;
}
function saveConditionFlow() {
    const inputs = document.querySelectorAll(".flow-condition-input");
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
    return conditions;
}

function saveQuestions() {
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
    
    return stateQuestions;
}

function saveCategories() {
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
    
return categories;
}

function saveEntities() {
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
    
return entities;
}

function saveResponses() {
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
    
    return stateResponses;
}

function saveTriggers() {
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

    return triggers;
}

function saveMultipleChoice() {
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
   
return multipleChoices;
}

function saveGenerators() {
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
     
return generators;
}

function saveActions() {
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
    
return actions;

}

function loadFlows() {
    const flowContainer = document.getElementById('flowsContainer');
    botData.dialogue_flows.forEach(flow => {
        const flowElement = document.createElement('div');
        flowElement.className = 'flow';
        flowElement.innerHTML = `
            <div class="flow-header">Flow ID: ${flow.id}</div>
            <button class="toggle-states-button"></button>
        `;
        flowContainer.appendChild(flowElement);

        const statesContainer = document.createElement('div');
        statesContainer.id = `statesContainer-${flow.id}`;
        statesContainer.className = 'states-container';
        flowContainer.appendChild(statesContainer);

        const addStateButton = document.createElement('button');
        addStateButton.id = "addStateButton";
        addStateButton.textContent = "Add State";
        statesContainer.appendChild(addStateButton);

        const hrElement = document.createElement('hr');
        flowContainer.appendChild(hrElement);

        addStateButton.addEventListener('click', function() {
            console.log('Add State Button Clicked');
            var modalState = document.getElementById('modalOverlayState');
            modalState.style.display = 'flex';
            
            const flowIdInputMonologue = document.querySelectorAll('.state-flow-id-monologue');
            const flowIdInputDialogue = document.querySelectorAll('.state-flow-id-dialogue');
            
            if (flowIdInputMonologue.length > 0) {
                flowIdInputMonologue.forEach(input1 => {
                    input1.value = flowId;  
                });
            } else {
                console.error('No elements with class "state-flow-id-monologue" found.');
            }
            
            if (flowIdInputDialogue.length > 0) {
                flowIdInputDialogue.forEach(input2 => {
                    input2.value = flowId;  
                });
            } else {
                console.error('No elements with class "state-flow-id-dialogue" found.');
            }
        });

        flow.states.forEach(state => {
            const stateElement = document.createElement('div');
            stateElement.className = 'state';
            stateElement.innerHTML = `<div class="state-header">State ID: ${state.id}</div>
                                      <div class="state-header">State Type: ${state.type}</div>`;
            statesContainer.appendChild(stateElement);
        });
        const toggleStatesButton = flowElement.querySelector('.toggle-states-button');
        toggleStatesButton.style.backgroundImage = 'url("../images/visible.png")'; 

        toggleStatesButton.addEventListener('click', function () {
            if (statesContainer.style.display === 'flex' || statesContainer.style.display === '') {
                statesContainer.style.display = 'none';
                toggleStatesButton.style.backgroundImage = 'url("../images/hidden.png")';
            } else {
                statesContainer.style.display = 'flex';
                toggleStatesButton.style.backgroundImage = 'url("../images/visible.png")';
            }
        });
    });
}

function saveBotData() {
    localStorage.setItem('botData', JSON.stringify(botData));
}


