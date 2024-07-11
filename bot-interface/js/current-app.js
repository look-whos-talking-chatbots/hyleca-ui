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
        // loadFlows();
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
    let stateFlowId, statesContainerId;

    if (addStateButton && addStateButton.parentElement) {
        statesContainerId = addStateButton.parentElement.id;
        const regex = /statesContainer-(\d+)/;
        const match = statesContainerId.match(regex);
        if (match) {
            stateFlowId = match[1];
            console.log(stateFlowId); 
        } else {
            console.error('ID does not match the expected format');
        }
    } else {
        console.error('addStateButton element not found or has no parent element');
    }

    const newState = {
        id: Math.random(),
        title:"",
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
        editState(newState.id)
    });

    statesContainer.appendChild(stateElement);

    if (addStateButton) {
        statesContainer.insertBefore(stateElement, addStateButton);
    } else {
        statesContainer.appendChild(stateElement);
    }

    console.log(botData);
    alert('New state added!');
}

function editState(stateId) {
    var modal = document.getElementById('modalOverlayState');
    modal.style.display = 'flex';

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
    // document.getElementById('state-id').value = state.id;
    // targetState.type = document.getElementById('stateType').value;
    const stateElement = document.getElementById('state-info');
   
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
    document.getElementById('editBtn').addEventListener('click',function(){
       updateState(targetFlow,targetState)
    })
    
}
function updateState(targetFlow, updatedState) {
    console.log(updatedState.id)
    const stateName = document.getElementById('state-name');
    updatedState.title = stateName.value;
    const stateType = document.getElementById('state-type');
    updatedState.type = stateType.value;
    const stateIndex = targetFlow.states.findIndex(state => state.id === updatedState.id);
    if (stateIndex !== -1) {
        console.log("stateIndex"+stateIndex);
        targetFlow.states[stateIndex] = updatedState;
        saveBotData();
        alert("State updated");
    } else {
        console.error(`State with id ${updatedState.id} not found in targetFlow.`);
    }

    document.getElementById('modalOverlayState').style.display = 'none';

    document.getElementById('add-state').classList.add('hidden');
    document.getElementById('state-info').style.display ='none';
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

function showFeatureInputs(featureId) {
    document.querySelectorAll('.featuresContainer').forEach(container => {
        container.classList.add('hidden');
    });

    document.querySelectorAll(`#${featureId}`).forEach(featureInput => {
        featureInput.classList.remove('hidden');
    });
}

function showSpecificFeatureInputs(featureId) {
    const elements = document.querySelectorAll(`#${featureId}`);

    if (elements.length > 0) {
        elements.forEach(element => {
            element.classList.remove('hidden');
        });
    } else {
        console.error(`No elements found for ${featureId}`);
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

function addResponseAgain(button){
    const responseInputs=document.getElementById('responseInputs')

    const responsecontainer = document.createElement('div');
    responsecontainer.id= 'responses-container';
    
    const conditionsContainer = document.createElement('div');
    conditionsContainer.id = 'conditions-container';
    conditionsContainer.innerHTML = `
        <button type="button" onclick="showSpecificFeatureInputs('response-condition')">Add Condition</button>
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
        <button type="button" onclick="showSpecificFeatureInputs('response-text')">Add Text</button>
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

    const firstButton = responseInputs.querySelector('.addButtonResponse');
    if (firstButton) {
        responseInputs.insertBefore(responsecontainer, firstButton);
    } else {
        responseInputs.appendChild(responsecontainer);
    }
}

function addQuestionAgain(button) {
    const questionInputs =document.getElementById('questionInputs');
    
    const questionsContainer = document.createElement('div');
    questionsContainer.id = 'questions-container';
    
    const questionConditionsContainer = document.createElement('div');
    questionConditionsContainer.id = 'question-conditions-container';
    questionConditionsContainer.innerHTML = `
        <button type="button" onclick="showSpecificFeatureInputs('question-condition')">Add Condition</button>
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
        <button type="button" onclick="showSpecificFeatureInputs('question-text')">Add Text</button>
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
    
 
    const firstButton = questionInputs.querySelector('.addButtonQuestion');
    if (firstButton) {
        questionInputs.insertBefore(questionsContainer, firstButton);
    } else {
        questionInputs.appendChild(questionsContainer);
    }

}

function addTriggersAgain(button) {
    const triggerInputs = document.getElementById('triggerInputs');

    const triggerConditionsContainer = document.createElement('div');
    triggerConditionsContainer.id = 'trigger-conditions-container';
    triggerConditionsContainer.innerHTML = `
        <button type="button" onclick="showSpecificFeatureInputs('triggers-condition')">Add Condition</button>
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
        <button type="button" onclick="showSpecificFeatureInputs('triggers-trigger')">Add Trigger</button>
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
    
    const addButtonTriggers = triggerInputs.querySelector('.addButtonTriggers');
    
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
    const inputTypeId = button.parentElement.id;
    const targetElement = document.getElementById(`${inputTypeId}`);
    if (targetElement) {
        targetElement.classList.add('hidden');
    }
    document.querySelector('.featuresContainer').classList.remove('hidden');

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
    const conditionInputs = document.querySelectorAll('.question-condition-input');
    const textInputs = document.querySelectorAll('.question-text-input');
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
    const conditionInputs = document.querySelectorAll('.response-condition-input');
    const textInputs = document.querySelectorAll('.response-text-input');
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

// function loadFlows() {
//     const flowContainer = document.getElementById('flowsContainer');
//     flowContainer.innerHTML = '';

//     botData.dialogue_flows.forEach(flow => {
//         const flowElement = document.createElement('div');
//         flowElement.className = 'flow';
//         flowElement.innerHTML = `
//             <div class="flow-header">Flow ID: ${flow.id}</div>
//             <button class="toggle-states-button"></button>
//         `;
//         flowContainer.appendChild(flowElement);

//         const statesContainer = document.createElement('div');
//         statesContainer.id = `statesContainer-${flow.id}`;
//         statesContainer.className = 'states-container';
//         flowContainer.appendChild(statesContainer);

//         const addStateButton = document.createElement('button');
//         addStateButton.id = "addStateButton";
//         addStateButton.textContent = "Add State";
//         statesContainer.appendChild(addStateButton);

//         const hrElement = document.createElement('hr');
//         flowContainer.appendChild(hrElement);

//         addStateButton.addEventListener('click', function() {
//             addState();
//         });

//         flow.states.forEach(state => {
//             const stateElement = document.createElement('div');
//             stateElement.id = `${state.id}`;
//             stateElement.className = 'state';   
//             let stateContent = `<div class="state-header">State Type: ${state.type}</div>`;
//             if (state.type === 'monologue') {
//                 stateContent += `<div class="state-responses">Responses: <br> ${JSON.stringify(state.responses)}</div>`;
//             } else if (state.type === 'dialogue') {
//                 stateContent += `<div class="state-questions">Questions: <br> ${JSON.stringify(state.questions)}</div>`;
//             }
//             stateElement.innerHTML = stateContent;
//             stateElement.addEventListener('click', () => {
//                 var modal = document.getElementById('modalOverlayState');
//                 modal.style.display = 'flex';
//                 addEventListenersToStateButtons(state.id)

//             });
//             statesContainer.appendChild(stateElement);
//             const addStateButton = statesContainer.querySelector("#addStateButton");
//             if (addStateButton) {
//                 statesContainer.insertBefore(stateElement, addStateButton);
//             } else {
//                 statesContainer.appendChild(stateElement);
//             }
//         });

//         const toggleStatesButton = flowElement.querySelector('.toggle-states-button');
//         toggleStatesButton.style.backgroundImage = 'url("../images/visible.png")'; 

//         toggleStatesButton.addEventListener('click', function () {
//             if (statesContainer.style.display === 'flex' || statesContainer.style.display === '') {
//                 statesContainer.style.display = 'none';
//                 toggleStatesButton.style.backgroundImage = 'url("../images/hidden.png")';
//             } else {
//                 statesContainer.style.display = 'flex';
//                 toggleStatesButton.style.backgroundImage = 'url("../images/visible.png")';
//             }
//         });
        
//     });
   
// }

function saveBotData() {
    localStorage.setItem('botData', JSON.stringify(botData));
}

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

    document.querySelector('.featuresContainer').classList.add('hidden');
    document.querySelector(`#${inputId}`).classList.remove('hidden');
    document.querySelector(`#update-${inputId}`).classList.remove('hidden');


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





