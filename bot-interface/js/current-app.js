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

let featuresState = {};

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
            addState();
        });
    } else {
        console.error('addStateButton not found.');
    }
    
});

function addEventListenersToStateButtons(stateId) {
    document.getElementById('monologue-state-btn').addEventListener('click', function() {
        showMonologueForm(stateId);
    });
    document.getElementById('dialogue-state-btn').addEventListener('click', function() {
        showDialogueForm(stateId);
    });
}

function showMonologueForm(stateId) {
    document.getElementById('monologue-state-btn').classList.add('hidden');
    document.getElementById('dialogue-state-btn').classList.add('hidden');
    document.getElementById('add-monologue-state').classList.remove('hidden');
    document.getElementById('state-info-monologue').style.display ='flex';
    document.getElementById('add-dialogue-state').classList.add('hidden');
    editState(stateId);
}

function showDialogueForm(stateId) {
    document.getElementById('dialogue-state-btn').classList.add('hidden');
    document.getElementById('monologue-state-btn').classList.add('hidden');
    document.getElementById('add-dialogue-state').classList.remove('hidden');
    document.getElementById('state-info-dialogue').style.display ='flex';
    document.getElementById('add-monologue-state').classList.add('hidden');
    editState(stateId);
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
        <div class="flow-header">Flow Name: ${flowTitle}</div>
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
        addState();        
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


function addState() {
    const addStateButton = document.querySelector('#addStateButton');
    let stateId, stateFlowId, statesContainerId;

    if (addStateButton && addStateButton.parentElement) {
        statesContainerId = addStateButton.parentElement.id;
        const regex = /statesContainer-(\d+)/;
        const match = statesContainerId.match(regex);
        if (match) {
            stateFlowId = match[1]; // Extract the captured group (the number)
            console.log(stateFlowId); // Output: 1111 (if the format matches)
        } else {
            console.error('ID does not match the expected format');
        }
    } else {
        console.error('addStateButton element not found or has no parent element');
    }

    const newState = {
        id: Math.random(),
        type: "",
        conditions: [],
        questions: [],
        categories: [],
        entities: [],
        responses: [],
        triggers: [],
        multipleChoices: [],
        generators: [],
        actions: []
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
    const statesContainer = addStateButton.parentElement;
    const stateElement = document.createElement('div');
    stateElement.id = `${newState.id}`;
    stateElement.className = 'state';
    stateElement.innerHTML = `<div class="state-header">State Id: ${newState.id}</div>
                            <div class="state-header">State Type: ${newState.type}</div>`;
    stateElement.addEventListener('click', () => {
        var modal = document.getElementById('modalOverlayState');
        modal.style.display = 'flex';
        addEventListenersToStateButtons(newState.id)

    });

    statesContainer.appendChild(stateElement);

    if (addStateButton) {
        statesContainer.insertBefore(stateElement, addStateButton);
    } else {
        statesContainer.appendChild(stateElement);
    }

    console.log(botData);
    alert('New state added!');
    addEventListenersToStateButtons(newState.id)
}

function editState(stateId) {
    const saveButtons = document.querySelectorAll('.save');
    console.log("editstate çalıştı " + stateId);
    
    let targetState = null;
    let targetFlow = null;

    botData.dialogue_flows.forEach(flow => {
        const state = flow.states.find(state => state.id === stateId);
        if (state) {
            targetState = state;
            targetFlow = flow;
        }
    });

    if (!targetState) {
        console.error(`State with id ${stateId} not found.`);
        return;
    }

    saveButtons.forEach(button => {
        button.onclick = function() {
            resetInput(this);
            if (button.id.includes('saveCondition')) {
                saveConditions(targetState);
            } else if (button.id.includes('saveQuestion')) {
                saveQuestions(targetState);
            } else if (button.id.includes('saveCategory')) {
                saveCategories(targetState);
            } else if (button.id.includes('saveEntity')) {
                saveEntities(targetState);
            } else if (button.id.includes('saveResponse')) {
                saveResponses(targetState);
            } else if (button.id.includes('saveTrigger')) {
                saveTriggers(targetState);
            } else if (button.id.includes('saveMultipleChoice')) {
                saveMultipleChoice(targetState);
            } else if (button.id.includes('saveGenerator')) {
                saveGenerators(targetState);
            } else if (button.id.includes('saveAction')) {
                saveActions(targetState);
            }
        };
    });

    console.log(targetState);
    let stateElement;
    const monologueForm = document.getElementById('add-monologue-state');
    const dialogueForm = document.getElementById('add-dialogue-state');
    if (!monologueForm.classList.contains('hidden')) {
        document.querySelector('#add-monologue-state #state-id').value = stateId;
        stateElement = document.getElementById('state-info-monologue');
        targetState.type='monologue';
    } else if (!dialogueForm.classList.contains('hidden')) {
        document.querySelector('#add-dialogue-state #state-id').value = stateId;
        stateElement = document.getElementById('state-info-dialogue');
        targetState.type='dialogue';
    }
    console.log("aaa" + stateElement.id)

    stateElement.innerHTML = '';
    const stateFeatures = [
        { label: 'Conditions', value: targetState.conditions },
        { label: 'Questions', value: targetState.questions },
        { label: 'Categories', value: targetState.categories },
        { label: 'Entities', value: targetState.entities },
        { label: 'Responses', value: targetState.responses },
        { label: 'Triggers', value: targetState.triggers },
        { label: 'Multiple Choices', value: targetState.multipleChoices },
        { label: 'Generators', value: targetState.generators },
        { label: 'Actions', value: targetState.actions }
    ];

    stateFeatures.forEach(feature => {
        const featureContainer = document.createElement('div');
        const detailElement = document.createElement('p');
        detailElement.innerHTML = `<strong>${feature.label}:</strong> ${JSON.stringify(feature.value)}`;
        featureContainer.appendChild(detailElement);
        stateElement.appendChild(featureContainer);
    });
    document.getElementById('editBtnMonologue').addEventListener('click',function(){
       updateState(targetFlow,targetState)
    })
    document.getElementById('editBtnDialogue').addEventListener('click',function(){
        updateState(targetFlow,targetState)
     })
    
}
function updateState(targetFlow, updatedState) {
    console.log("updateState clicked")
    const stateIndex = targetFlow.states.findIndex(state => state.id === updatedState.id);
    if (stateIndex !== -1) {
        targetFlow.states[stateIndex] = updatedState;
        saveBotData();
        alert("State updated");
    } else {
        console.error(`State with id ${updatedState.id} not found in targetFlow.`);
    }

    document.getElementById('modalOverlayState').style.display = 'none';

    document.getElementById('add-monologue-state').classList.add('hidden');
    document.getElementById('add-dialogue-state').classList.add('hidden');
    document.getElementById('state-info-monologue').style.display ='none';
    document.getElementById('state-info-dialogue').style.display ='none';
    document.getElementById('monologue-state-btn').classList.remove('hidden');
    document.getElementById('dialogue-state-btn').classList.remove('hidden');
    console.log(updatedState);
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

function showResponseConditionInputs(button) {
    const form = button.parentElement.parentElement.parentElement.parentElement;
    if (form.id === "add-monologue-state") {
        document.querySelectorAll('#add-monologue-state #response-condition').forEach(element => {
            element.classList.remove('hidden');
        });
    } else if (form.id === "add-dialogue-state") {
        document.querySelectorAll('#add-dialogue-state #response-condition').forEach(element => {
            element.classList.remove('hidden');
        });
    }
}

function showTextInput(button) {
    const form = button.parentElement.parentElement.parentElement.parentElement;
    if (form.id === "add-monologue-state") {
        document.querySelectorAll('#add-monologue-state #response-text').forEach(element => {
            element.classList.remove('hidden');
        });
    } else if (form.id === "add-dialogue-state") {
        document.querySelectorAll('#add-dialogue-state #response-text').forEach(element => {
            element.classList.remove('hidden');
        });
    }
}


function showTriggersConditionInputs(button) {
    const form = button.parentElement.parentElement.parentElement;
    let triggersConditionElements;
    if (form.id === "add-monologue-state") {
        triggersConditionElements = document.querySelectorAll('#add-monologue-state #triggers-condition');
    } else if (form.id === "add-dialogue-state") {
        triggersConditionElements = document.querySelectorAll('#add-dialogue-state #triggers-condition');
    }

    if (triggersConditionElements && triggersConditionElements.length > 0) {
        triggersConditionElements.forEach(element => {
            element.classList.remove('hidden');
        });
    } else {
        console.error("No elements found for triggers condition inputs");
    }
}

function showTriggersTriggerInput(button) {
    const form = button.parentElement.parentElement.parentElement;
    let triggerTextElements;

    if (form.id === "add-monologue-state") {
        triggerTextElements = document.querySelectorAll('#add-monologue-state #triggers-trigger');
    } else if (form.id === "add-dialogue-state") {
        triggerTextElements = document.querySelectorAll('#add-dialogue-state #triggers-trigger');
    }

    if (triggerTextElements && triggerTextElements.length > 0) {
        triggerTextElements.forEach(element => {
            element.classList.remove('hidden');
        });
    } else {
        console.error("No elements found for triggers trigger inputs");
    }
}

function showQuestionConditionInputs(button) {
    const form = button.parentElement.parentElement.parentElement.parentElement;
    let questionConditionElements;
    
    if (form.id === "add-monologue-state") {
        questionConditionElements = document.querySelectorAll('#add-monologue-state #question-condition');
    } else if (form.id === "add-dialogue-state") {
        questionConditionElements = document.querySelectorAll('#add-dialogue-state #question-condition');
    }
    
    questionConditionElements.forEach(element => {
        element.classList.remove('hidden');
    });
}

function showQuestionTextInput(button) {
    const form = button.parentElement.parentElement.parentElement.parentElement;
    let questionTextElements;
    
    if (form.id === "add-monologue-state") {
        questionTextElements = document.querySelectorAll('#add-monologue-state #question-text');
    } else if (form.id === "add-dialogue-state") {
        questionTextElements = document.querySelectorAll('#add-dialogue-state #question-text');
    }
    
    questionTextElements.forEach(element => {
        element.classList.remove('hidden');
    });
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

function addResponseAgain(button){
    const form = button.parentElement.parentElement;
    let responseInputs;
    if (form.id === "add-monologue-state") {
        responseInputs = document.querySelector('#add-monologue-state #responseInputs');

    } else if (form.id === "add-dialogue-state") {
        responseInputs = document.querySelector('#add-dialogue-state #responseInputs');
    }
    const responsecontainer = document.createElement('div');
    responsecontainer.id= 'responses-container';
    
    const conditionsContainer = document.createElement('div');
    conditionsContainer.id = 'conditions-container';
    conditionsContainer.innerHTML = `
        <button type="button" onclick="showResponseConditionInputs(this)">Add Condition</button>
    `;
    
    const responseCondition = document.createElement('div');
    responseCondition.id = 'response-condition';
    responseCondition.className = 'input-group hidden';
    responseCondition.innerHTML = `
        <input type="text" class="response-condition-input" placeholder="input1">
        <input type="text" class="response-condition-input" placeholder="operator">
        <input type="text" class="response-condition-input" placeholder="null">
        <button type="button" onclick="addConditionInput(this)">+</button>
        <button type="button" onclick="remove(this)">-</button>
    `;
    
    const textContainer = document.createElement('div');
    textContainer.id = 'text-container';
    textContainer.innerHTML = `
        <button type="button" onclick="showTextInput(this)">Add Text</button>
    `;
    
    const responseText = document.createElement('div');
    responseText.id = 'response-text';
    responseText.className = 'input-group hidden';
    responseText.innerHTML = `
        <input type="text" class="response-text-input" placeholder="text">
        <button type="button" onclick="addTextInput(this)">+</button>
        <button type="button" onclick="remove(this)">-</button>
    `;
    
    responsecontainer.appendChild(conditionsContainer);
    responsecontainer.appendChild(responseCondition);
    responsecontainer.appendChild(textContainer);
    responsecontainer.appendChild(responseText);
    
    if (form.id === "add-monologue-state") {
        const firstButton = responseInputs.querySelector('#add-monologue-state .addButtonResponse');
        if (firstButton) {
            responseInputs.insertBefore(responsecontainer, firstButton);
        } else {
            responseInputs.appendChild(responsecontainer);
        }
    } else if (form.id === "add-dialogue-state") {
        const firstButton = responseInputs.querySelector('#add-dialogue-state .addButtonResponse');
        if (firstButton) {
            responseInputs.insertBefore(responsecontainer, firstButton);
        } else {
            responseInputs.appendChild(responsecontainer);
        }
    }
}

function addQuestionAgain(button) {
    const form = button.parentElement.parentElement;
    let questionInputs;
    
    if (form.id === "add-monologue-state") {
        questionInputs = document.querySelector('#add-monologue-state #questionInputs');
    } else if (form.id === "add-dialogue-state") {
        questionInputs = document.querySelector('#add-dialogue-state #questionInputs');
    }
    
    const questionsContainer = document.createElement('div');
    questionsContainer.id = 'questions-container';
    
    const questionConditionsContainer = document.createElement('div');
    questionConditionsContainer.id = 'question-conditions-container';
    questionConditionsContainer.innerHTML = `
        <button type="button" onclick="showQuestionConditionInputs(this)">Add Condition</button>
    `;
    
    const questionCondition = document.createElement('div');
    questionCondition.id = 'question-condition';
    questionCondition.className = 'input-group hidden';
    questionCondition.innerHTML = `
        <input type="text" class="question-condition-input" placeholder="input1">
        <input type="text" class="question-condition-input" placeholder="operator">
        <input type="text" class="question-condition-input" placeholder="null">
        <button type="button" onclick="addConditionInput(this)">+</button>
        <button type="button" onclick="remove(this)">-</button>
    `;
    
    const questionTextContainer = document.createElement('div');
    questionTextContainer.id = 'question-text-container';
    questionTextContainer.innerHTML = `
        <button type="button" onclick="showQuestionTextInput(this)">Add Text</button>
    `;
    
    const questionText = document.createElement('div');
    questionText.id = 'question-text';
    questionText.className = 'input-group hidden';
    questionText.innerHTML = `
        <input type="text" class="question-text-input" placeholder="text">
        <button type="button" onclick="addTextInput(this)">+</button>
        <button type="button" onclick="remove(this)">-</button>
    `;
    
    questionsContainer.appendChild(questionConditionsContainer);
    questionsContainer.appendChild(questionCondition);
    questionsContainer.appendChild(questionTextContainer);
    questionsContainer.appendChild(questionText);
    
    if (form.id === "add-monologue-state") {
        const firstButton = questionInputs.querySelector('#add-monologue-state .addButtonQuestion');
        if (firstButton) {
            questionInputs.insertBefore(questionsContainer, firstButton);
        } else {
            questionInputs.appendChild(questionsContainer);
        }
    } else if (form.id === "add-dialogue-state") {
        const firstButton = questionInputs.querySelector('#add-dialogue-state .addButtonQuestion');
        if (firstButton) {
            questionInputs.insertBefore(questionsContainer, firstButton);
        } else {
            questionInputs.appendChild(questionsContainer);
        }
    }
}

function addTriggersAgain(button) {
    const form = button.parentElement.parentElement;
    let triggerInputs;
    if (form.id === "add-monologue-state") {
        triggerInputs = document.querySelector('#add-monologue-state #triggerInputs');
    } else if (form.id === "add-dialogue-state") {
        triggerInputs = document.querySelector('#add-dialogue-state #triggerInputs');
    }
    
    
    const triggerConditionsContainer = document.createElement('div');
    triggerConditionsContainer.id = 'trigger-conditions-container';
    triggerConditionsContainer.innerHTML = `
        <button type="button" onclick="showTriggersConditionInputs(this)">Add Condition</button>
    `;
    
    const triggersCondition = document.createElement('div');
    triggersCondition.id = 'triggers-condition';
    triggersCondition.className = 'input-group hidden';
    triggersCondition.innerHTML = `
        <input type="text" class="triggers-condition-input" placeholder="input1">
        <input type="text" class="triggers-condition-input" placeholder="operator">
        <input type="text" class="triggers-condition-input" placeholder="null">
        <button type="button" onclick="addConditionInput(this)">+</button>
        <button type="button" onclick="remove(this)">-</button>
    `;
    const triggersTriggerContainer = document.createElement('div');
    triggersTriggerContainer.className = 'trigger-container';
    triggersTriggerContainer.innerHTML = `
        <button type="button" onclick="showTriggersTriggerInput(this)">Add Trigger</button>
    `;
    
    const triggersTrigger = document.createElement('div');
    triggersTrigger.id = 'triggers-trigger';
    triggersTrigger.className = 'input-group hidden';
    triggersTrigger.innerHTML = `
        <input type="text" class="trigger-state" placeholder="state">
        <input type="number" class="trigger-state-id" placeholder="state id">
        <button type="button" onclick="addTriggerInput(this)">+</button>
        <button type="button" onclick="remove(this)">-</button>
    `;
    
    triggerInputs.appendChild(triggerConditionsContainer);
    triggerInputs.appendChild(triggersCondition);
    triggerInputs.appendChild(triggersTriggerContainer);
    triggerInputs.appendChild(triggersTrigger);
    
    const addButtonTriggers = triggerInputs.querySelector('.addButtonTriggers');
    const saveTriggersButton = triggerInputs.querySelector('button[onclick="handleButtonTrigger(this)"]');
    
    triggerInputs.insertBefore(triggerConditionsContainer, addButtonTriggers);
    triggerInputs.insertBefore(triggersCondition, addButtonTriggers);
    triggerInputs.insertBefore(triggersTriggerContainer, addButtonTriggers);
    triggerInputs.insertBefore(triggersTrigger, addButtonTriggers);
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

function saveConditions(state) {
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
    state.conditions = conditions;
    editState(state.id);
    return conditions;
}

function saveQuestions(state) {
    const monologueForm = document.getElementById('add-monologue-state');
    const dialogueForm = document.getElementById('add-dialogue-state');
    
    // Check if monologue form is visible
    const isMonologueVisible = !monologueForm.classList.contains('hidden');
    const form = isMonologueVisible ? monologueForm : dialogueForm;
    
    const conditionInputs = form.querySelectorAll('.question-condition-input');
    const textInputs = form.querySelectorAll('.question-text-input');
    const stateQuestions = [];
    
    let conditions = [];
    let texts = [];
    
    // Collect conditions
    conditionInputs.forEach((input, index) => {
        const value = input.value.trim();
        const finalValue = (value === "null") ? null : value;
        
        const inputType = index % 3;
        const groupIndex = Math.floor(index / 3);
        
        if (!conditions[groupIndex]) {
            conditions[groupIndex] = [];
        }
        
        conditions[groupIndex][inputType] = finalValue;
    });
    
    const groupedConditions = conditions.map(conditionGroup => conditionGroup.filter(Boolean));
    
    // Collect texts
    textInputs.forEach((input, index) => {
        const value = input.value.trim();
        if (value !== '') {
            texts.push([value]);
        }
    });
    
    // Merge conditions and texts into stateQuestions
    for (let i = 0; i < Math.max(groupedConditions.length, texts.length); i++) {
        stateQuestions.push({
            conditions: groupedConditions[i] || [],
            text: texts[i] || []
        });
    }
    
    console.log("State Questions:", stateQuestions);
    state.questions = stateQuestions;
    editState(state.id);
    return stateQuestions;
}

function saveCategories(state) {
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
    state.categories = categories;
    editState(state.id);
    return categories;
}

function saveEntities(state) {
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
    state.entities = entities;
    console.log(state);
    editState(state.id);
    return entities;
}

function saveResponses(state) {
    const monologueForm = document.getElementById('add-monologue-state');
    const dialogueForm = document.getElementById('add-dialogue-state');

    // Check if monologue form is visible
    const isMonologueVisible = !monologueForm.classList.contains('hidden');
    const form = isMonologueVisible ? monologueForm : dialogueForm;

    const conditionInputs = form.querySelectorAll('.response-condition-input');
    const textInputs = form.querySelectorAll('.response-text-input');
    const stateResponses = [];

    let conditions = [];
    let texts = [];

    // Collect conditions
    conditionInputs.forEach((input, index) => {
        const value = input.value.trim();
        const finalValue = (value === "null") ? null : value;

        const inputType = index % 3;
        const groupIndex = Math.floor(index / 3);

        if (!conditions[groupIndex]) {
            conditions[groupIndex] = [];
        }

        conditions[groupIndex][inputType] = finalValue;
    });

    const groupedConditions = conditions.map(conditionGroup => conditionGroup.filter(Boolean));

    // Collect texts
    textInputs.forEach((input, index) => {
        const value = input.value.trim();
        if (value !== '') {
            texts.push([value]);
        }
    });

    // Merge conditions and texts into stateResponses
    for (let i = 0; i < Math.max(groupedConditions.length, texts.length); i++) {
        stateResponses.push({
            conditions: groupedConditions[i] || [],
            text: texts[i] || []
        });
    }

    console.log("State Responses:", stateResponses);
    state.responses=stateResponses;
    editState(state.id);
    return stateResponses;
}

function saveTriggers(state) {
    const monologueForm = document.getElementById('add-monologue-state');
    const dialogueForm = document.getElementById('add-dialogue-state');

    // Check if monologue form is visible
    const isMonologueVisible = !monologueForm.classList.contains('hidden');
    const form = isMonologueVisible ? monologueForm : dialogueForm;

    const conditionInputs = form.querySelectorAll('.triggers-condition-input');
    const triggerStateInputs = form.querySelectorAll('.trigger-state');
    const triggerStateIdInputs = form.querySelectorAll('.trigger-state-id');
    
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

    const groupedConditions = conditions.map(conditionGroup => conditionGroup.filter(Boolean));

    // Collect triggers
    triggerStateInputs.forEach((input, index) => {
        const state = input.value.trim();
        const stateId = parseInt(triggerStateIdInputs[index].value.trim());

        if (state !== '' && !isNaN(stateId)) {
            triggers.push({
                conditions: groupedConditions[index] || [],
                trigger: [state, stateId]
            });
        }
    });

    console.log("Triggers:", triggers);
    state.triggers=triggers;
    editState(state.id);
    return triggers;
}

function saveMultipleChoice(state) {
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
    state.multipleChoices=multipleChoices;
    editState(state.id);
return multipleChoices;
}

function saveGenerators(state) {
    const inputs = document.querySelectorAll(".generator-input");
    const generators = [];
    for (let i = 0; i < inputs.length; i += 2) {
        const input1 = inputs[i].value;
        const input2 = inputs[i + 1].value;
        if (input1 !== '' && input2 !== '') {
        generators.push([input1, input2]);
        }
    }
    console.log("Generators:", generators);;
    state.generators=generators;
    editState(state.id);
return generators;
}

function saveActions(state) {
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
    state.actions=actions;
    editState(state.id);
return actions;

}

function loadFlows() {
    const flowContainer = document.getElementById('flowsContainer');
    flowContainer.innerHTML = '';

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
            addState();
        });

        flow.states.forEach(state => {
            const stateElement = document.createElement('div');
            stateElement.id = `${state.id}`;
            stateElement.className = 'state';   
            let stateContent = `<div class="state-header">State Type: ${state.type}</div>`;
            if (state.type === 'monologue') {
                stateContent += `<div class="state-responses">Responses: <br> ${JSON.stringify(state.responses)}</div>`;
            } else if (state.type === 'dialogue') {
                stateContent += `<div class="state-questions">Questions: <br> ${JSON.stringify(state.questions)}</div>`;
            }
            stateElement.innerHTML = stateContent;
            stateElement.addEventListener('click', () => {
                var modal = document.getElementById('modalOverlayState');
                modal.style.display = 'flex';
                addEventListenersToStateButtons(state.id)

            });
            statesContainer.appendChild(stateElement);
            const addStateButton = statesContainer.querySelector("#addStateButton");
            if (addStateButton) {
                statesContainer.insertBefore(stateElement, addStateButton);
            } else {
                statesContainer.appendChild(stateElement);
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
        
    });
   
}

function saveBotData() {
    localStorage.setItem('botData', JSON.stringify(botData));
}

// function updateAddedStates(newState) {
//     const addedStatesDiv = document.getElementById('added-states');

//     let stateElement = document.getElementById('state-info');
//     if (!stateElement) {
//         stateElement = document.createElement('div');
//         stateElement.id = 'state-info';
//         stateElement.className = 'state';
//         stateElement.innerHTML = `
//             <p>State ID: ${newState.id || 'undefined'}</p>
//             <p>Flow ID: ${newState.flowId || 'undefined'}</p>
//             <p>Type: ${newState.type || 'undefined'}</p>
//         `;
//         addedStatesDiv.appendChild(stateElement);
//     }

//     const stateDetails = [
//         { label: 'Conditions', value: newState.conditions },
//         { label: 'Questions', value: newState.questions },
//         { label: 'Categories', value: newState.categories },
//         { label: 'Entities', value: newState.entities },
//         { label: 'Responses', value: newState.responses },
//         { label: 'Triggers', value: newState.triggers },
//         { label: 'Multiple Choices', value: newState.multipleChoices },
//         { label: 'Generators', value: newState.generators },
//         { label: 'Actions', value: newState.actions }
//     ];

//     stateDetails.forEach(detail => {
//         if (detail.value && detail.value.length > 0) {
//             const detailContainer = document.createElement('div');
//             const detailElement = document.createElement('p');
//             detailElement.innerHTML = `<strong>${detail.label}:</strong> ${JSON.stringify(detail.value)}`;
//             detailContainer.appendChild(detailElement);

//             const editButton = document.createElement('button');
//             editButton.innerText = 'Edit';
//             editButton.addEventListener('click', function(event) {
//                 event.preventDefault();
//                 editDetail(detail.label, detail.value);
//             });
//             detailContainer.appendChild(editButton);

//             const deleteButton = document.createElement('button');
//             deleteButton.innerText = 'Delete';
//             deleteButton.onclick = () => deleteDetail(detail.label);
//             detailContainer.appendChild(deleteButton);

//             stateElement.appendChild(detailContainer);
//         }
//     });
// }

function editDetail(label, value) {
    let inputId = null;

    switch (label) {
        case 'Conditions':
            inputId = 'conditionInputs';
            break;
        case 'Questions':
            inputId = 'questionInputs';
            break;
        case 'Categories':
            inputId = 'categoryInputs';
            break;
        case 'Entities':
            inputId = 'entityInputs';
            break;
        case 'Responses':
            inputId = 'responseInputs';
            break;
        case 'Triggers':
            inputId = 'triggerInputs';
            break;
        case 'Multiple Choices':
            inputId = 'multipleChoiceInputs';
            break;
        case 'Generators':
            inputId = 'generatorInputs';
            break;
        case 'Actions':
            inputId = 'actionInputs';
            break;
        default:
            console.error(`Unsupported label: ${label}`);
            return;
    }

    const button = document.querySelector(".featureBtn");
    const form = button.parentElement.parentElement;

    if (form.id === "add-monologue-state") {
        document.querySelector('#add-monologue-state .featuresContainer').classList.add('hidden');
        document.querySelector(`#add-monologue-state #${inputId}`).classList.remove('hidden');
        document.querySelector(`#add-monologue-state #update-${inputId}`).classList.remove('hidden');
    } else if (form.id === "add-dialogue-state") {
        document.querySelector('#add-dialogue-state .featuresContainer').classList.add('hidden');
        document.querySelector(`#add-dialogue-state #${inputId}`).classList.remove('hidden');
        document.querySelector(`#add-dialogue-state #update-${inputId}`).classList.remove('hidden');
    }

    const inputElement = document.getElementById(inputId);
    if (!inputElement) {
        console.error(`Input element not found with ID: ${inputId}`);
        return;
    }

    const previousValue = JSON.parse(inputElement.value);
    Object.assign(previousValue, value); 

    inputElement.value = JSON.stringify(previousValue);

    switch (label) {
        case 'Conditions':
            featuresState.conditions = previousValue;
            break;
        case 'Questions':
            featuresState.questions = previousValue;
            break;
        case 'Categories':
            featuresState.categories = previousValue;
            break;
        case 'Entities':
            featuresState.entities = previousValue;
            break;
        case 'Responses':
            featuresState.responses = previousValue;
            break;
        case 'Triggers':
            featuresState.triggers = previousValue;
            break;
        case 'Multiple Choices':
            featuresState.multipleChoices = previousValue;
            break;
        case 'Generators':
            featuresState.generators = previousValue;
            break;
        case 'Actions':
            featuresState.actions = previousValue;
            break;
        default:
            console.error(`Unsupported label: ${label}`);
            return;
    }
}

function updateStateFeature(button) {
    const form = button.parentElement;
    const inputFields = form.querySelectorAll('.condition-input');
    const updatedValues = Array.from(inputFields).map(input => input.value);

    const label = 'Conditions'; 
    switch (label) {
        case 'Conditions':
            featuresState.conditions = updatedValues;
            break;
        default:
            console.error(`Unsupported label: ${label}`);
            return;
    }

    form.classList.add('hidden');

    return updatedValues;
}

function saveEdit() {
    // Implement save logic here
    console.log('Save edit');
    closeEditModal();
}

function closeEditModal() {
    const editModal = document.getElementById('editModal');
    editModal.classList.add('hidden');
}




