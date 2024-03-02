<script>
  
    
    let conditions = ['==', '!=', '>', '<', '>=', '<='];
    let editingIndex = null; // Index of the currently editing rule
    import { metadata} from './stores/metadata'
    if (!$metadata.rules) $metadata.rules=[]
    let fields=$metadata.forms.default.elements // get form fields

    let rules = $metadata.rules
    function addRule() {
      rules.push({ fieldName: '', condition: '', actionType: '', rightValue:'', targetField: '', actionValue: '' });
      rules=rules
      editingIndex=rules.length-1
      $metadata.rules = rules;
    }
  
    function deleteRule(index) {
      rules.splice(index, 1);
      if (editingIndex === index) {
        editingIndex = null; // Reset editing index if the currently edited rule is deleted
      }
      rules=rules
      $metadata.rules = rules;
    }
  
    function editRule(index) {
      editingIndex = index;
    }
  </script>
  
  <style>
    .rule-row {
      position: relative;
      padding: 10px;
      border: 1px solid #ccc;
      margin-bottom: 5px;
    }
    .rule-row:hover .edit-button {
      display: block;
    }
    .edit-button {
      display: none;
      position: absolute;
      top: 0;
      right: 0;
      cursor: pointer;
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", sans-serif, "Segoe UI", Helvetica, Arial;
        color: black;
        background-color: rgb(227, 206, 116);
        border-color: rgb(128, 128, 128);
        border-radius: 5px;
        padding: 5px;
    }
    .close-button {
      position: absolute;
      top: 5px;
      right: 5px;
      cursor: pointer;

    }    
    .action-row {

    }
    .oneLine {
        display: inline-block;
        margin-right: 10px;
        width:120px;
    }
    .input {
        background-color: black;
        color: white;
    }
    .rightValue {
        width: 150px;
    }
    .ruleEditor button {
        font-family: system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", sans-serif, "Segoe UI", Helvetica, Arial;
        font-size: 15px;
        min-width: 70px;
        color: black;
        background-color: rgb(227, 206, 116);
        border-color: rgb(128, 128, 128);
        border-radius: 5px;
        cursor: pointer;
        margin-right: 10px;
    }
    .ruleEditor .delete {
        background-color: red;
        color: white;
    }
  </style>
  

  <h2>Rules</h2>
 <div class="ruleEditor">
  {#each rules as rule, index}
    <div class="rule-row">
      {#if editingIndex === index}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class="close-button" on:click={() => { editingIndex=-1 }}>X</div>

        <!-- Inputs for editing -->

          <select bind:value={rule.fieldName}  class="oneLine input">
            <option value="">Field...</option>
            {#each fields as field}
              <option value={field.name}>{field.name}</option>
            {/each}
          </select>
          <select bind:value={rule.condition} class="oneLine input">
            <option value="">Condition...</option>
            {#each conditions as condition}
              <option value={condition}>{condition}</option>
            {/each}
          </select>
          <input type="text" class="input rightValue" placeholder="Value" bind:value={rule.rightValue}>

          <select bind:value={rule.actionType}  class="input">
            <option value="">Action...</option>
            <option value="setValue">Set Value</option>
            <option value="showField">Show/Hide</option>
          </select>
        {#if rule.actionType === 'setValue'}
          <div class="action-row">
              <select bind:value={rule.targetField} class="oneLine input">
                <option value="">Field...</option>
                {#each fields as field}
                  <option value={field.name}>{field.name}</option>
                {/each}
              </select>
              = <input type="text" bind:value={rule.actionValue} placeholder="Value"  class="oneLine input" style="width:270px">
          </div>
        {/if}
        <div><button on:click={() => deleteRule(index)} class="delete">Delete</button></div>
        

      {:else}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class="edit-button" on:click={() => editRule(index)}>Edit</div>
        <!-- Display Rule Summary -->
        <div> if {rule.fieldName} {rule.condition} {rule.rightValue}: {#if rule.actionType==="setValue"}set {rule.targetField}={rule.actionValue}{/if}</div>
      {/if}
    </div>
  {/each}
  <button on:click={addRule}>Add Rule</button>
</div>