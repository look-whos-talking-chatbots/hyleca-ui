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

document.getElementById('uploadButton').addEventListener('click', function() {
    document.getElementById('uploadJson').click();
});

document.getElementById('uploadJson').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const jsonContent = JSON.parse(e.target.result);
                updateBotData(jsonContent);
                alert('JSON data has been successfully uploaded and used.');
            } catch (error) {
                console.error('Error parsing JSON:', error);
                alert('Failed to parse JSON file. Please check the file format.');
            }
        };
        reader.readAsText(file);
    }
});

function updateBotData(jsonData) {
    botData = jsonData;
    saveBotData();
    initializeAppWithBotData();
}

document.addEventListener('DOMContentLoaded', (event) => {
    const savedBotData = localStorage.getItem('botData');
    if (savedBotData) {
        botData = JSON.parse(savedBotData);
        loadData();
    }

    document.getElementById('botName').textContent = botData.name + "-Bot";
    document.getElementById('botDescription').textContent = botData.description;

    document.getElementById('addFlowButton').addEventListener('click', function() {
        addFlow()
    });
});

function generateFlowId() {
    return Date.now();
}

function addFlow() {
    const newFlow = {
        id: generateFlowId(),
        title: "",
        description: "",
        conditions: [],
        states: []
    };

    botData.dialogue_flows.push(newFlow);
    saveBotData();

    const flowContainer = document.getElementById('flowsContainer');
    const flowElement = document.createElement('div');
    flowElement.className = 'flow';
    flowElement.innerHTML = `
        <div class="flow-header">Flow Name: ${newFlow.title}</div>
        <button class="delete-flow-button"></button>
        <button class="toggle-states-button"></button>
    `;
    
    flowContainer.appendChild(flowElement);

    const statesContainer = document.createElement('div');
    statesContainer.id = `statesContainer-${newFlow.id}`;
    statesContainer.className = 'states-container';
    flowContainer.appendChild(statesContainer);

    const addStateButton = document.createElement('button');
    addStateButton.id = "addStateButton"; 
    addStateButton.textContent = "Add State";
    statesContainer.appendChild(addStateButton);

    addStateButton.addEventListener('click', function() {
        console.log('Add State Button Clicked');
        addState(this);        
    });

    const hrElement = document.createElement('hr');
    flowContainer.appendChild(hrElement);

    const flowHeader = flowElement.querySelector('.flow-header');
    flowHeader.addEventListener('click', () => {
        editFlow(newFlow.id);
    });

    flowElement.querySelector('.delete-flow-button').addEventListener('click', () => {
        deleteFlow(newFlow.id);
        statesContainer.remove();
        flowElement.remove();
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

    console.log(botData);
    alert('New flow added!');
}

function editFlow(flowId) {
    console.log('Edit Flow Button Clicked');
    var modal = document.getElementById('modalOverlayFlow');
    modal.style.display = 'flex';

    const flowTitleInput = document.getElementById('flowTitle');
    const flowDescriptionInput = document.getElementById('flowDescription');

    let targetFlow = botData.dialogue_flows.find(flow => flow.id === flowId);
    if (!targetFlow) {
        console.error(`Flow with id ${flowId} not found.`);
        return;
    }

    flowTitleInput.value = targetFlow.title;
    flowDescriptionInput.value = targetFlow.description;
    setConditionFlowValues(targetFlow);

    const editFlowBtn = document.getElementById('editFlowBtn');
    editFlowBtn.onclick = () => updateFlow(targetFlow);

    const toggleStatesButton = document.querySelector(`.toggle-states-button`);
    toggleStatesButton.style.backgroundImage = 'url("../images/visible.png")'; 

    toggleStatesButton.addEventListener('click', function () {
        const statesContainer = document.getElementById(`statesContainer-${flowId}`);
        if (statesContainer.style.display === 'flex' || statesContainer.style.display === '') {
            statesContainer.style.display = 'none';
            toggleStatesButton.style.backgroundImage = 'url("../images/hidden.png")';
        } else {
            statesContainer.style.display = 'flex';
            toggleStatesButton.style.backgroundImage = 'url("../images/visible.png")';
        }
    });
}

function updateFlow(updatedFlow) {
    const flowTitleInput = document.getElementById('flowTitle').value;
    const flowDescriptionInput = document.getElementById('flowDescription').value;
    if (!flowTitleInput) {
        alert('Please fill out flow name!');
        return;
    }
    updatedFlow.title = flowTitleInput;
    updatedFlow.description = flowDescriptionInput;
    updatedFlow.conditions = saveConditionFlow();

    const flowIndex = botData.dialogue_flows.findIndex(flow => flow.id === updatedFlow.id);
    if (flowIndex !== -1) {
        botData.dialogue_flows[flowIndex] = updatedFlow;
        saveBotData();
        alert("Flow Updated");

         // Update flow header title in the DOM
         const flowHeader = document.querySelector(`.flow-header[data-flow-id='${updatedFlow.id}']`);
         if (flowHeader) {
             flowHeader.textContent = `Flow Name: ${updatedFlow.title}`;
         } else {
             console.error(`Flow header element not found for flow id ${updatedFlow.id}`);
         }
         window.location.reload();


    } else {
        console.error(`Flow with id ${updatedFlow.id} not found.`);
    }
    
    document.getElementById('addFlowForm').reset();
    document.getElementById('modalOverlayFlow').style.display = 'none';
}
function deleteFlow(flowId) {
    const flowIndex = botData.dialogue_flows.findIndex(flow => flow.id === flowId);
    if (flowIndex !== -1) {
        botData.dialogue_flows.splice(flowIndex, 1);
        saveBotData();
        console.log(`Flow with ID ${flowId} deleted`);
    } else {
        console.error(`Flow with ID ${flowId} not found`);
    }
}

function generateStateId() {
    return Date.now();
}

function addState(button) {
    let stateFlowId, statesContainerId;

    if (button && button.parentElement) {
        statesContainerId = button.parentElement.id;
        const regex = /statesContainer-(\d+)/;
        const match = statesContainerId.match(regex);
        if (match) {
            stateFlowId = match[1];
            console.log(stateFlowId);
        } else {
            console.error('ID does not match the expected format');
        }
    }

    const newState = {
        id: generateStateId(),
        title: "",
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

    const targetFlow = botData.dialogue_flows.find(flow => flow.id === parseInt(stateFlowId));
    if (targetFlow) {
        targetFlow.states.push(newState);
        saveBotData();
    } else {
        console.error("Target Flow not found for ID:", stateFlowId);
        return;
    }

    const statesContainer = button.parentElement;
    const stateElement = document.createElement('div');
    stateElement.id = `${newState.id}`;
    stateElement.className = 'state';
    let stateContent = `
                <div class="state-header">
                    Name: ${newState.title || 'N/A'}
                    <div>${newState.type || 'N/A'} state</div>
                </div>
                <hr>
            `;
        
            if (newState.type === 'monologue') {
                const formattedResponses = newState.responses.map(response => 
                    `<div class="response-item">
                        <strong>Conditions:</strong> ${response.conditions.length ? response.conditions.join(', ') : 'None'}<br>
                        <strong>Text:</strong> ${response.text}
                    </div>`
                ).join('');
                stateContent += `<div class="state-responses">Responses: ${formattedResponses}</div>`;
            } else if (newState.type === 'dialogue') {
                const formattedQuestions = newState.questions.map(question => 
                    `<div class="question-item">
                        <strong>Conditions:</strong> ${question.conditions.length ? question.conditions.join(', ') : 'None'}<br>
                        <strong>Text:</strong> ${question.text}
                    </div>`
                ).join('');
                stateContent += `<div class="state-questions">Questions: ${formattedQuestions}</div>`;
            }
        
            const stateContentDiv = document.createElement('div');
            stateContentDiv.className = 'state-content';
            stateContentDiv.innerHTML = stateContent;
        
            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-state-button';
        
            // Create the warning message if any of the specified conditions are met
            let warningMessage = '';
            if (!newState.title || !newState.type) {
                warningMessage += '<div class="warning">State is missing a name or type.</div>';
            }
            if (newState.type === 'monologue' && (!newState.responses || newState.responses.length === 0)) {
                warningMessage += '<div class="warning">Monologue state has no responses.</div>';
            }
            if (newState.type === 'dialogue' && (!newState.questions || newState.questions.length === 0)) {
                warningMessage += '<div class="warning">Dialogue state has no questions.</div>';
            }

            // Create the warning message div
            const warningDiv = document.createElement('div');
            warningDiv.className = 'warning';
            warningDiv.innerHTML = warningMessage;
            
            const stateFooter = document.createElement('div');
            stateFooter.className='stateFooter';

            stateFooter.appendChild(deleteButton);
            stateFooter.appendChild(warningDiv);
        
            // Append elements to stateElement
            stateElement.appendChild(stateContentDiv);
            stateElement.appendChild(stateFooter);
        
            stateContentDiv.addEventListener('click', () => {
                editState(newState.id);
            });
        
            deleteButton.addEventListener('click', (event) => {
                event.stopPropagation(); 
                deleteState(targetFlow.id, newState.id);
                stateElement.remove();
            });
            statesContainer.insertBefore(stateElement, button);

    console.log(botData);
    alert('New state added!');
}
function deleteState(flowId, stateId) {
    const flow = botData.dialogue_flows.find(flow => flow.id === flowId);
    if (flow) {
        const stateIndex = flow.states.findIndex(state => state.id === stateId);
        if (stateIndex !== -1) {
            flow.states.splice(stateIndex, 1);
            saveBotData();
            console.log(`State with ID ${stateId} deleted from Flow ID ${flowId}`);
        } else {
            console.error(`State with ID ${stateId} not found in Flow ID ${flowId}`);
        }
    } else {
        console.error(`Flow with ID ${flowId} not found`);
    }
}

function editState(stateId) {
    const modal = document.getElementById('modalOverlayState');
    modal.style.display = 'flex';

    const saveButtons = document.querySelectorAll('.save');
    console.log("editState called for stateId: " + stateId);

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
    
    setConditionValues(targetState);
    setQuestionValues(targetState);
    setCategoryValues(targetState);
    setEntityValues(targetState);
    setResponseValues(targetState);
    setTriggerValues(targetState);
    setMultipleChoiceValues(targetState);
    setGeneratorValues(targetState);
    setActionValues(targetState);

    const stateName = document.getElementById('state-name');
    stateName.value = targetState.title;

    const stateType = document.getElementById('state-type');
    stateType.value = targetState.type

    saveButtons.forEach(button => {
        button.onclick = function () {
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

    const editBtn = document.getElementById('editBtn');
    editBtn.onclick = () => updateState(targetFlow, targetState);

    const stateElement = document.getElementById('state-info');
    stateElement.innerHTML = '';
    const stateFeatures = [
        { label: 'Conditions', value: targetState.conditions },
        { label: 'Questions', value: targetState.questions },
        { label: 'Categories', value: targetState.categories },
        { label: 'Entities', value: targetState.entities },
        { label: 'Responses', value: targetState.responses },
        { label: 'Triggers', value: formatTriggers(targetState.triggers)},
        { label: 'Multiple Choices', value: targetState.multipleChoices },
        { label: 'Generators', value: targetState.generators },
        { label: 'Actions', value: targetState.actions }
    ];

    stateFeatures.forEach(feature => {
        const featureContainer = document.createElement('div');
        featureContainer.classList.add('state-feature');
        const detailElement = document.createElement('p');
        detailElement.innerHTML = `<strong>${feature.label}:</strong><br> ${formatFeatureValue(feature.value)}`;
        featureContainer.appendChild(detailElement);
        stateElement.appendChild(featureContainer);
    });
}
function formatFeatureValue(value) {
    if (!value) {
        return 'None'; 
    }

    if (Array.isArray(value) && value.length > 0) {
        return value.map(item => {
            if (typeof item === 'object' && item !== null) {
                return `<div class="feature-item">${Object.entries(item).map(([key, val]) => `<strong>${key}:</strong> ${val}`).join('<br>')}</div>`;
            }
            return item;
        }).join('<br>');
    }
    return value.length === 0 ? 'None' : value;
}


function formatTriggers(triggers) {
    return triggers.map(trigger => {
        const [type, id] = trigger.trigger;
        const title = getTitleFromId(type, id);
        return {
            ...trigger,
            trigger: [type, title]
        };
    });
}

function getTitleFromId(type, id) {
    if (type === 'state') {
        for (const flow of botData.dialogue_flows) {
            const state = flow.states.find(state => state.id === id);
            if (state) {
                return state.title;
            }
        }
    } else if (type === 'flow') {
        const flow = botData.dialogue_flows.find(flow => flow.id === id);
        if (flow) {
            return flow.title;
        }
    }
    return id;
}

function updateState(targetFlow, updatedState) {
    console.log(updatedState.id);
    const stateName = document.getElementById('state-name').value;
    if (!stateName) {
        alert('Please fill out all state name');
        return;
    }
    updatedState.title = stateName;

    const stateType = document.getElementById('state-type').value;
    if (!stateType) {
        alert('Please choose state type');
        return;
    }
    updatedState.type = stateType;
    

    const stateIndex = targetFlow.states.findIndex(state => state.id === updatedState.id);
    if (stateIndex !== -1) {
        console.log("stateIndex: " + stateIndex);
        targetFlow.states[stateIndex] = updatedState;
        saveBotData();
        alert("State updated");
        
        window.location.reload();
       
    } else {
        console.error(`State with id ${updatedState.id} not found in targetFlow.`);
    }

    document.getElementById('modalOverlayState').style.display = 'none';
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

function addInput(button) {
    const container = button.parentElement.parentElement;
    const inputClass = button.parentElement.querySelector('input').className;
    const div = document.createElement("div");
    div.className = "input-group";
    div.innerHTML = `
        <input type="text" class="${inputClass}" placeholder="input1">
        <input type="text" class="${inputClass}" placeholder="input2">
        <button type="button" onclick="addInput(this)">+</button>
        <button type="button" onclick="remove(this)">-</button>
    `;
    container.appendChild(div);
}

function addConditionInput(button) {
    const container = button.parentElement;
    const inputClass = button.parentElement.querySelector('input').className;
    const div = document.createElement("div");
    div.className = "input-group";
    div.innerHTML = `
        <input type="text" class="${inputClass}" placeholder="input1">
        <input type="text" class="${inputClass}" placeholder="null">
        <select class="${inputClass}">
            <option disabled selected></option>
            <option value="!=">!=</option>
            <option value=">">&gt;</option>
            <option value="<">&lt;</option>
            <option value=">=">&gt;=</option>
            <option value="<=">&lt;=</option>
            <option value="in">in</option>
            <option value="!in">!in</option>
        </select>
        <button type="button" onclick="addConditionInput(this)">+</button>
        <button type="button" onclick="remove(this)">-</button>
    `;
    container.appendChild(div);
}

function addTextInput(button) {
    const container = button.parentElement.parentElement;
    const inputClass = button.parentElement.querySelector('input').className;
    const div = document.createElement("div");
    div.className = "input-group";
    div.innerHTML = `
        <input type="text" class="${inputClass}" placeholder="text">
        <button type="button" onclick="addTextInput(this)">+</button>
        <button type="button" onclick="remove(this)">-</button>
    `;
    container.appendChild(div);
}

function addTriggerInput(button){
    const container = button.parentElement.parentElement;
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
        <input type="text" class="response-condition-input" placeholder="null">
        <select type="text" class="response-condition-input" placeholder="operator">
                <option disabled selected></option>
                <option value="!=">!=</option>
                <option value=">">&gt;</option>
                <option value="<">&lt;</option>
                <option value=">=">&gt;=</option>
                <option value="<=">&lt;=</option>
                <option value="in">in</option>
                <option value="!in">!in</option>
            </select>
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
    const questionInputs = document.getElementById('questionInputs');
    
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
        <input type="text" class="question-condition-input" placeholder="null">
        <select class="question-condition-input" placeholder="operator">
            <option disabled selected></option>
            <option value="!=">!=</option>
            <option value=">">&gt;</option>
            <option value="<">&lt;</option>
            <option value=">=">&gt;=</option>
            <option value="<=">&lt;=</option>
            <option value="in">in</option>
            <option value="!in">!in</option>
        </select>
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

function saveQuestions(state) {
    const questionContainers = document.querySelectorAll('#questions-container');
    const stateQuestions = [];

    questionContainers.forEach((container, index) => {
        const conditions = [];
        const conditionInputs = container.querySelectorAll('.question-condition-input');
        
        // Collect conditions
        for (let i = 0; i < conditionInputs.length; i += 3) {
            const condition = [
                conditionInputs[i].value.trim(),
                conditionInputs[i + 1].value.trim(),
                conditionInputs[i + 2].value.trim()
            ].map(value => value === "null" ? null : value);
            conditions.push(condition);
        }

        // Collect texts
        const textInputs = container.querySelectorAll('.question-text-input');
        const texts = Array.from(textInputs).map(input => input.value.trim()).filter(value => value !== '');

        stateQuestions.push({
            conditions: conditions.filter(Boolean), // Remove empty conditions
            text: texts
        });
    });

    console.log("State Questions:", stateQuestions);
    state.questions = stateQuestions;
    editState(state.id); // Assuming a function to edit state
    return stateQuestions;
}

function addTriggersAgain(button) {
    const triggerInputs = document.getElementById('triggerInputs');

    const triggersContainer = document.createElement('div');
    triggersContainer.className = 'triggers-container';

    const triggerConditionsContainer = document.createElement('div');
    triggerConditionsContainer.className = 'trigger-conditions-container';
    triggerConditionsContainer.innerHTML = `
        <button type="button" onclick="showSpecificFeatureInputs('triggers-condition')">Add Condition</button>
    `;

    const triggersCondition = document.createElement('div');
    triggersCondition.id = 'triggers-condition';
    triggersCondition.className = 'input-group hidden';
    triggersCondition.innerHTML = `
        <input type="text" class="triggers-condition-input" placeholder="input1">
        <input type="text" class="triggers-condition-input" placeholder="value">
        <select class="triggers-condition-input" placeholder="operator">
            <option disabled selected></option>
            <option value="!=">!=</option>
            <option value=">">&gt;</option>
            <option value="<">&lt;</option>
            <option value=">=">&gt;=</option>
            <option value="<=">&lt;=</option>
            <option value="in">in</option>
            <option value="!in">!in</option>
        </select>
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
        <select class="trigger-state">
            <option value="flow">Flow</option>
            <option value="state">State</option>
        </select>
        <input class="trigger-state-id" placeholder="Name">
        <button type="button" onclick="addTriggerInput(this)">+</button>
        <button type="button" onclick="remove(this)">-</button>
    `;

    const addButtonTriggers = triggerInputs.querySelector('.addButtonTriggers');

    triggersContainer.appendChild(triggerConditionsContainer);
    triggersContainer.appendChild(triggersCondition);
    triggersContainer.appendChild(triggersTriggerContainer);
    triggersContainer.appendChild(triggersTrigger);
    
    triggerInputs.insertBefore(triggersContainer, addButtonTriggers);
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
function setConditionFlowValues(state) {
    const inputs = document.querySelectorAll(".flow-condition-input");
    const conditions = state.conditions;

    if (conditions && conditions.length) {
        inputs.forEach((input, index) => {
            const groupIndex = Math.floor(index / 3);
            const inputType = index % 3;

            if (conditions[groupIndex] && conditions[groupIndex][inputType] !== undefined) {
                input.value = conditions[groupIndex][inputType] === null ? 'null' : conditions[groupIndex][inputType];
            } else {
                input.value = '';
            }
        });
    }
}

function saveConditions(state) {
    const inputs = document.querySelectorAll(".condition-input");
    const conditions = [];

    inputs.forEach((input, index) => {
        const value = input.value.trim();
        const finalValue = (value === "null") ? null : value;

        if (value !== '') {
            const inputType = index % 3;
            const groupIndex = Math.floor(index / 3);

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

function setConditionValues(state) {
    const inputs = document.querySelectorAll(".condition-input");
    const conditions = state.conditions;

    if (conditions && conditions.length) {
        inputs.forEach((input, index) => {
            const groupIndex = Math.floor(index / 3);
            const inputType = index % 3;

            if (conditions[groupIndex] && conditions[groupIndex][inputType] !== undefined) {
                input.value = conditions[groupIndex][inputType] === null ? 'null' : conditions[groupIndex][inputType];
            } else {
                input.value = '';
            }
        });
    }
}

function saveQuestions(state) {
    const questionContainers = document.querySelectorAll('#questions-container');
    const stateQuestions = [];

    questionContainers.forEach((container, index) => {
        const conditions = [];
        const conditionInputs = container.querySelectorAll('.question-condition-input');
        
        // Collect conditions
        for (let i = 0; i < conditionInputs.length; i += 3) {
            const condition = [
                conditionInputs[i].value.trim(),
                conditionInputs[i + 1].value.trim(),
                conditionInputs[i + 2].value.trim()
            ].map(value => value === "null" ? null : value);
            conditions.push(condition);
        }

        // Collect texts
        const textInputs = container.querySelectorAll('.question-text-input');
        const texts = Array.from(textInputs).map(input => input.value.trim()).filter(value => value !== '');

        stateQuestions.push({
            conditions: conditions.filter(Boolean), // Remove empty conditions
            text: texts
        });
    });

    console.log("State Questions:", stateQuestions);
    state.questions = stateQuestions;
    editState(state.id); // Assuming a function to edit state
    return stateQuestions;
}
function setQuestionValues(state) {
    const questionContainers = document.querySelectorAll('#questions-container');
    const stateQuestions = state.questions || [];

    questionContainers.forEach((container, index) => {
        const questionData = stateQuestions[index] || { conditions: [], text: [] };

        const conditionInputs = container.querySelectorAll('.question-condition-input');
        questionData.conditions.forEach((condition, groupIndex) => {
            for (let i = 0; i < 3; i++) {
                conditionInputs[groupIndex * 3 + i].value = condition[i] === null ? 'null' : condition[i];
            }
        });

        const textInputs = container.querySelectorAll('.question-text-input');
        questionData.text.forEach((text, textIndex) => {
            if (textInputs[textIndex]) {
                textInputs[textIndex].value = text;
            }
        });
    });
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
function setCategoryValues(state) {
    const inputs = document.querySelectorAll(".category-input");
    const categories = state.categories || [];

    inputs.forEach((input, index) => {
        const groupIndex = Math.floor(index / 2);
        if (categories[groupIndex] && categories[groupIndex][index % 2] !== undefined) {
            input.value = categories[groupIndex][index % 2];
        } else {
            input.value = '';
        }
    });
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
function setEntityValues(state) {
    const inputs = document.querySelectorAll(".entity-input");
    const entities = state.entities || [];

    inputs.forEach((input, index) => {
        const groupIndex = Math.floor(index / 2);
        if (entities[groupIndex] && entities[groupIndex][index % 2] !== undefined) {
            input.value = entities[groupIndex][index % 2];
        } else {
            input.value = '';
        }
    });
}

function saveResponses(state) {
    const conditionGroups = document.querySelectorAll('#response-condition');
    const textGroups = document.querySelectorAll('#response-text');
    const stateResponses = [];

    conditionGroups.forEach((conditionGroup, index) => {
        const conditions = [];
        const inputs = conditionGroup.querySelectorAll('.response-condition-input');
        
        // Collect conditions
        for (let i = 0; i < inputs.length; i += 3) {
            const condition = [
                inputs[i].value.trim(),
                inputs[i + 1].value.trim(),
                inputs[i + 2].value.trim()
            ].map(value => value === "null" ? null : value);
            conditions.push(condition);
        }

        // Collect texts
        const texts = [];
        const textInputs = textGroups[index].querySelectorAll('.response-text-input');
        textInputs.forEach(input => {
            const value = input.value.trim();
            if (value !== '') {
                texts.push(value);
            }
        });

        stateResponses.push({
            conditions: conditions.filter(Boolean), // Remove empty conditions
            text: texts
        });
    });

    console.log("State Responses:", stateResponses);
    state.responses = stateResponses;
    editState(state.id);
    return stateResponses;
}
function setResponseValues(state) {
    const conditionGroups = document.querySelectorAll('#response-condition');
    const textGroups = document.querySelectorAll('#response-text');
    const stateResponses = state.responses || [];

    conditionGroups.forEach((conditionGroup, index) => {
        const responseData = stateResponses[index] || { conditions: [], text: [] };

        const conditionInputs = conditionGroup.querySelectorAll('.response-condition-input');
        responseData.conditions.forEach((condition, groupIndex) => {
            for (let i = 0; i < 3; i++) {
                conditionInputs[groupIndex * 3 + i].value = condition[i] === null ? 'null' : condition[i];
            }
        });

        const textInputs = textGroups[index].querySelectorAll('.response-text-input');
        responseData.text.forEach((text, textIndex) => {
            if (textInputs[textIndex]) {
                textInputs[textIndex].value = text;
            }
        });
    });
}

function saveTriggers(state) {
    const conditionGroups = document.querySelectorAll('#triggers-condition');
    const triggerStateInputs = document.querySelectorAll('.trigger-state');
    const triggerStateIdInputs = document.querySelectorAll('.trigger-state-id');
    const triggers = [];

    conditionGroups.forEach((conditionGroup, index) => {
        const conditions = [];
        const inputs = conditionGroup.querySelectorAll('.triggers-condition-input');
        
        // Collect conditions
        for (let i = 0; i < inputs.length; i += 3) {
            const condition = [
                inputs[i].value.trim(),
                inputs[i + 1].value.trim(),
                inputs[i + 2].value.trim()
            ].map(value => value === "null" ? null : value);
            conditions.push(condition);
        }

        // Collect trigger state
        const selectedStateOrFlow = triggerStateInputs[index].value.trim();
        const title = triggerStateIdInputs[index].value.trim();
        let stateId = null;

        if (selectedStateOrFlow === 'state') {
            const targetState = botData.dialogue_flows
                .flatMap(flow => flow.states)
                .find(state => state.title === title);
            stateId = targetState ? targetState.id : null;
        } else if (selectedStateOrFlow === 'flow') {
            const targetFlow = botData.dialogue_flows.find(flow => flow.title === title);
            stateId = targetFlow ? targetFlow.id : null;
        }

        if (selectedStateOrFlow !== '' && stateId !== null) {
            triggers.push({
                conditions: conditions.filter(Boolean), 
                trigger: [selectedStateOrFlow, stateId]
            });
        }
    });

    console.log("Triggers:", triggers);
    state.triggers = triggers;
    editState(state.id); // Assuming a function to edit state
    return triggers;
}

function setTriggerValues(state) {
    const conditionGroups = document.querySelectorAll('#triggers-condition');
    const triggerStateInputs = document.querySelectorAll('.trigger-state');
    const triggerStateIdInputs = document.querySelectorAll('.trigger-state-id');
    const triggers = state.triggers || [];

    conditionGroups.forEach((conditionGroup, index) => {
        const triggerData = triggers[index] || { conditions: [], trigger: [] };

        const conditionInputs = conditionGroup.querySelectorAll('.triggers-condition-input');
        triggerData.conditions.forEach((condition, groupIndex) => {
            for (let i = 0; i < 3; i++) {
                conditionInputs[groupIndex * 3 + i].value = condition[i] === null ? 'null' : condition[i];
            }
        });

        if (triggerStateInputs[index]) {
            triggerStateInputs[index].value = triggerData.trigger[0] || '';
        }
        if (triggerStateIdInputs[index]) {
            const title = triggerData.trigger[0] === 'state' ?
                botData.dialogue_flows.flatMap(flow => flow.states).find(state => state.id === triggerData.trigger[1])?.title :
                botData.dialogue_flows.find(flow => flow.id === triggerData.trigger[1])?.title;
            triggerStateIdInputs[index].value = title || '';
        }
    });
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

function setMultipleChoiceValues(state) {
    const inputs = document.querySelectorAll(".multipleChoice-input");
    const multipleChoices = state.multipleChoices || [];

    inputs.forEach((input, index) => {
        const groupIndex = Math.floor(index / 2);
        if (multipleChoices[groupIndex] && multipleChoices[groupIndex][index % 2] !== undefined) {
            input.value = multipleChoices[groupIndex][index % 2];
        } else {
            input.value = '';
        }
    });
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
function setGeneratorValues(state) {
    const inputs = document.querySelectorAll(".generator-input");
    const generators = state.generators || [];

    inputs.forEach((input, index) => {
        const groupIndex = Math.floor(index / 2);
        if (generators[groupIndex] && generators[groupIndex][index % 2] !== undefined) {
            input.value = generators[groupIndex][index % 2];
        } else {
            input.value = '';
        }
    });
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
function setActionValues(state) {
    const inputs = document.querySelectorAll(".action-input");
    const actions = state.actions || [];

    inputs.forEach((input, index) => {
        const groupIndex = Math.floor(index / 2);
        if (actions[groupIndex] && actions[groupIndex][index % 2] !== undefined) {
            input.value = actions[groupIndex][index % 2];
        } else {
            input.value = '';
        }
    });
}

function saveBotData() {
    localStorage.setItem('botData', JSON.stringify(botData));
}
function loadData() {
    const data = localStorage.getItem('botData');
    if (data) {
        botData = JSON.parse(data);
        initializeAppWithBotData();
    }
}


function initializeAppWithBotData() {
    const flowContainer = document.getElementById('flowsContainer');
    flowContainer.innerHTML = '';

    botData.dialogue_flows.forEach(flow => {
        const flowElement = document.createElement('div');
        flowElement.className = 'flow';
        flowElement.innerHTML = `
            <div class="flow-header">Flow Name: ${flow.title}</div>
            <button class="delete-flow-button"></button>
            <button class="toggle-states-button"></button>
        `;
        
        flowContainer.appendChild(flowElement);

        const statesContainer = document.createElement('div');
        statesContainer.id = `statesContainer-${flow.id}`;
        statesContainer.className = 'states-container';
        flowContainer.appendChild(statesContainer);

        flowElement.querySelector('.delete-flow-button').addEventListener('click', () => {
            deleteFlow(flow.id);
            flowElement.remove();
            statesContainer.remove();
        });

        const addStateButton = document.createElement('button');
        addStateButton.id = "addStateButton";
        addStateButton.textContent = "Add State";
        statesContainer.appendChild(addStateButton);

        const hrElement = document.createElement('hr');
        flowContainer.appendChild(hrElement);

        const flowHeader = flowElement.querySelector('.flow-header');
        flowHeader.addEventListener('click', () => {
            editFlow(flow.id);
        });

        addStateButton.addEventListener('click', function() {
            addState(this);
        });
        flow.states.forEach(state => {
            const stateElement = document.createElement('div');
            stateElement.id = `${state.id}`;
            stateElement.className = 'state';   
        
            // Initialize state header
            let stateContent = `
                <div class="state-header">
                    Name: ${state.title || 'N/A'}
                    <div>${state.type || 'N/A'} state</div>
                </div>
                <hr>
            `;
        
            // Create state content div
            const stateContentDiv = document.createElement('div');
            stateContentDiv.className = 'state-content';
            
            // Create delete button
            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-state-button';
        
            // Create the warning message div
            const warningDiv = document.createElement('div');
            warningDiv.className = 'warning';
        
            // Function to update content based on state type
            const updateStateContent = (state) => {
                let content = `
                    <div class="state-header">
                        Name: ${state.title || 'N/A'}
                        <div>${state.type || 'N/A'} state</div>
                    </div>
                    <hr>
                `;
                if (state.type === 'monologue') {
                    const formattedResponses = state.responses.map(response => 
                        `<div class="response-item">
                            <strong>Conditions:</strong> ${response.conditions.length ? response.conditions.join(', ') : 'None'}<br>
                            <strong>Text:</strong> ${response.text}
                        </div>`
                    ).join('');
                    content += `<div class="state-responses">Responses: ${formattedResponses}</div>`;
                } else if (state.type === 'dialogue') {
                    const formattedQuestions = state.questions.map(question => 
                        `<div class="question-item">
                            <strong>Conditions:</strong> ${question.conditions.length ? question.conditions.join(', ') : 'None'}<br>
                            <strong>Text:</strong> ${question.text}
                        </div>`
                    ).join('');
                    content += `<div class="state-questions">Questions: ${formattedQuestions}</div>`;
                }
                stateContentDiv.innerHTML = content;
        
                // Update the warning message
                let warningMessage = '';
                if (!state.title || state.title === 'undefined' || !state.type) {
                    warningMessage += '<div class="warning">State is missing a name or type.</div>';
                }
                if (state.type === 'monologue' && (!state.responses || state.responses.length === 0)) {
                    warningMessage += '<div class="warning">Monologue state has no responses.</div>';
                }
                if (state.type === 'dialogue' && (!state.questions || state.questions.length === 0)) {
                    warningMessage += '<div class="warning">Dialogue state has no questions.</div>';
                }
                warningDiv.innerHTML = warningMessage;
            };
        
            // Initial update of state content
            updateStateContent(state);

            const stateFooter = document.createElement('div');
            stateFooter.className='stateFooter';

            stateFooter.appendChild(deleteButton);
            stateFooter.appendChild(warningDiv);
        
            // Append elements to stateElement
            stateElement.appendChild(stateContentDiv);
            stateElement.appendChild(stateFooter);

            // stateElement.appendChild(deleteButton);
            // stateElement.appendChild(warningDiv);
        
            // Add event listeners
            stateContentDiv.addEventListener('click', () => {
                editState(state.id);
                // Update state content and warning message after editing
                updateStateContent(state);
            });
        
            deleteButton.addEventListener('click', (event) => {
                event.stopPropagation(); 
                deleteState(flow.id, state.id);
                stateElement.remove();
            });
        
            // Append the state element to the container
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

        // Add flow header click event to edit flow
        flowHeader.addEventListener('click', () => {
            editFlow(flow.id);
        });
        
        // Add state button click event to add state
        addStateButton.addEventListener('click', function() {
            addState(flow.id);
        });
    });
}











