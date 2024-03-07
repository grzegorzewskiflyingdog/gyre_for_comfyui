<script>
    import FormBuilder from "./FormBuilder.svelte"
    import RuleEditor from "./RuleEditor.svelte"
    import Mappings from "./Mappings.svelte"

    import {writable} from 'svelte/store'
    import {onMount} from 'svelte'
    import {metadata} from './stores/metadata'
    import Icon from './Icon.svelte'
    import { workflowStructurePass } from './workflowStructurePass.js'

    let allworkflows;
    let moving = false;
    let left = 10
    let top = 10
    let styleel;
    let loadedworkflow;

    let foldOut = false
    let name = ""   // current loaded workflow name
    let state = "list"
    let tags = ["Txt2Image", "Inpainting", "ControlNet", "LayerMenu", "Deactivated"]
    let workflowList = writable([])    // todo:load all workflow basic data (name, last changed and gyre object) from server via server request
    let activatedTags = {}
    let selectedTag = ""

  

    function onMouseDown() {
        moving = true;
    }

    function onMouseMove(e) {
        if (moving) {
            left += e.movementX;
            top += e.movementY;
        }
    }

    onMount(async () => {
        await loadList();
        addExternalLoadListener();
    })


    function addExternalLoadListener() {
        const fileInput = document.getElementById("comfy-file-input");
        const fileInputListener = async () => {
            if (fileInput && fileInput.files && fileInput.files.length > 0) {
                console.log(fileInput, fileInput.files);
                new Date(fileInput.files[0].lastModified).toDateString()
                let fixedfilename = getAvalableFileName(fileInput.files[0].name);
                let graph = window.app.graph.serialize();
                graph.name = fixedfilename;
                graph.lastModified = fileInput.files[0].lastModified
                if (!graph.extra?.workspace_info) graph.extra.workspace_info = [];
                graph.extra.workspace_info.name = fixedfilename;
                graph.extra.workspace_info.lastModified = fileInput.files[0].lastModified;
                graph.extra.workspace_info.lastModifiedReadable = new Date(fileInput.files[0].lastModified).toISOString().split('T')[0];
                if (!graph.extra.gyre) {
                    graph.extra.gyre = {};
                }
                graph.extra.gyre.lastModified = fileInput.files[0].lastModified;
                graph.extra.gyre.lastModifiedReadable = new Date(fileInput.files[0].lastModified).toISOString().split('T')[0];

                loadedworkflow = graph;
                loadWorkflow(graph);
            }
        };
        fileInput?.addEventListener("change", fileInputListener);
    }
    function getAvalableFileName(name) {
        if (!name) return 'new';
        return name;
        let ind = 1;
        let goodname = false;
        let ext = name.split('.').pop();
        name = name.replace(/\.[^/.]+$/, "");
        let newname = name;
        while (!goodname) {
            let allcurrnames = allworkflows.map((el) => el.name);
            if (allcurrnames.includes(name)) {
                newname = `${name}(${ind})`;
                ind = ind + 1;
            } else {
                goodname = true;
            }
        }
        return `${newname}`;
    }


    function onMouseUp() {
        moving = false;
    }


    function isVisible(workflow) {
        let mytags = workflow?.gyre?.tags || [];
        for (let activeTag in activatedTags) {
            if (activatedTags[activeTag] && !mytags.includes(activeTag)) return false
        }
        return true
    }


    async function loadList() {
        // todo: make server request and read $metadata of all existing workflows on filesystem
        let result = await scanLocalNewFiles()
        let data_workflow_list = result.map((el) => {
            let res = {name: el.name}
            let gyre = null;
            if (el.json) gyre = JSON.parse(el.json).extra.gyre;
            res.lastModifiedReadable = JSON.parse(el.json).extra.gyre?.lastModifiedReadable || "";
            if (gyre) {
                res.gyre = gyre;
                res.gyre.lastModifiedReadable = JSON.parse(el.json).extra.gyre?.lastModifiedReadable || "";
                res.gyre.lastModified = JSON.parse(el.json).extra.gyre?.lastModified || "";
            }
            return res
        })
        console.log(data_workflow_list);
        workflowList.set(data_workflow_list)
    }

    async function scanLocalNewFiles() {
        let existFlowIds = [];
        try {
            const response = await fetch("/workspace/readworkflowdir", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    path: "",
                    existFlowIds,
                }),
            });
            let result = await response.json();
            result = fixDatesFromServer(result);
            allworkflows = result;
            return result;
        } catch (error) {
            console.error("Error scan local new files:", error);
        }
    }

    function fixDatesFromServer(result) {
        let newel = result.map((el) => {
            let objjs = JSON.parse(el.json);
            objjs.extra.gyre.lastModified = new Date(el.lastmodified * 1000).getTime();
            let datestr = new Date(el.lastmodified * 1000).toISOString();
            objjs.extra.gyre.lastModifiedReadable = datestr.split('T')[0] + " " + datestr.split('T')[1].replace(/\.[^/.]+$/, "");
            let json = JSON.stringify(objjs);
            return {...el, json}
        })
        return newel;
    }


    async function loadWorkflow(workflow) {
        await loadList();
        // todo:check if current workflow is unsaved and make confirm otherwise
        // 1. make server request by workflow.name, getting full workflow data here
        // 2. update ComfyUI with new workflow
        // 3. set name and $metadata here
        if (!workflow.gyre) {
            workflow.gyre = {};
            workflow.gyre.tags = [];
        }
        console.log("load workflow!!");
        name = workflow.name
        $metadata = workflow.gyre;
        if (!$metadata.tags) $metadata.tags=[]
        if (window.app.graph == null) {
            console.error("app.graph is null cannot load workflow");
            return;
        }

        let current = allworkflows.find((el) => {
            return el.name == workflow.name;
        })

        if (!loadedworkflow) {
            if (!current) {
                window.app.loadGraphData(workflow);
            } else {
                let wf = JSON.parse(current.json);
                if (!wf.name && name) wf.name = name;
                window.app.loadGraphData(wf);
            }
        state="properties"
        }
    }


    function testFirstPass() {
        let workflow=window.app.graph.serialize()
        workflow=JSON.parse(JSON.stringify(workflow))
        console.log(workflow)
        let ws=new workflowStructurePass(workflow)
        ws.duplicateGroupWithNodesAndLinks("controlnet[]")
        console.log(workflow)
        window.app.loadGraphData(workflow);
    }
    function showStructure() {
        let workflow=window.app.graph.serialize()
        console.log(workflow)
    }
    async function saveWorkflow() {
        console.log("saveWorkflow");
        let graph = window.app.graph.serialize();

        // this is scenario just after loading workflow and not save it
        if (loadedworkflow && loadedworkflow.extra.workspace_info) {
            graph.extra = loadedworkflow.extra;
            $metadata = loadedworkflow.extra.gyre;
        }
        loadedworkflow = null;

        let file_path = graph.extra?.workspace_info?.name || "new.json";
        if (name) {
            file_path = name
        }
        if (!file_path.endsWith('.json')) {
            // Add .json extension if it doesn't exist
            file_path += '.json';
        }
        if ($metadata && graph.extra) graph.extra.gyre = $metadata;

        const graphJson = JSON.stringify(graph);
        await updateFile(file_path, graphJson);

        // todo:get workflow fom comfyUI
        // $metadata should already point to extras.gyre - so nothing to do here
        // 1. make server request, with  name and full workflow, store it on filesystem there
        // 2. set unsaved state to false
        // 3. load list of all workflows again
        alert("save workflow " + name) // remove
        saveDevelopJson(graph);
        await loadList();
    }

    async function saveDevelopJson(graph) {

        window.app.graphToPrompt().then(p=> {
            const apirawjson = JSON.stringify(p.output, null, 2); // convert the data to a JSON string
            console.log("json for devellop!!",apirawjson);
             createGyreApiJson(graph,apirawjson);
        });
    }



    function createGyreApiJson(graph,apirawjson){
        debugger;
        let apirawjsonobj =  JSON.parse(apirawjson);
        let alldata = JSON.stringify({graph,apirawjsonobj});
        let file_path = graph.extra?.workspace_info?.name || "new.json";
        if (name) {
            file_path = name
        }
        if (!file_path.endsWith('.json')) {
            // Add .json extension if it doesn't exist
            file_path += '.json';
        }
        updateApiFile(file_path,alldata);
    }

    async function updateApiFile(file_path,jsonData) {
        try {
            const response = await fetch("/workspace/update_api_json_file", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    file_path: file_path,
                    json_str: jsonData,
                }),
            });
            const result = await response.text();
            return result;
        } catch (error) {
            alert("Error saving workflow .json file: " + error);
            console.error("Error saving workspace:", error);
        }
    }


    async function updateFile(file_path, jsonData) {
        try {
            const response = await fetch("/workspace/update_json_file", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    file_path: file_path,
                    json_str: jsonData,
                }),
            });
            const result = await response.text();
            return result;
        } catch (error) {
            alert("Error saving workflow .json file: " + error);
            console.error("Error saving workspace:", error);
        }
    }


    function addTag() {
        if (!selectedTag) return
        if (!$metadata.tags) $metadata.tags = []
        $metadata.tags.push(selectedTag)
        $metadata = $metadata
    }

    function removeTag(tag) {
        const index = $metadata.tags.indexOf(tag);
        $metadata.tags.splice(index, 1);
        $metadata = $metadata
    }
</script>

<div id="workflowManager" class="workflowManager" style="left: {left}px; top: {top}px;">
  <div class="miniMenu">
            <div class="moveIcon">
                <Icon name="move" on:mousedown={onMouseDown}></Icon>
            </div>
            <div class="title">

                {#if !name}
                    <Icon name="Gyre" class="gyreLogo"></Icon>
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <div on:click={(e) => {foldOut=true}} style="display:inline-block">Gyre</div>
                {:else}
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <div on:click={(e) => {foldOut=true}} style="display:inline-block">{name}</div>
                    <div style="display: inline-block" class="saveIcon">
                        <Icon name="save" on:click={(e) => {saveWorkflow()}} ></Icon>                
                    </div>
                {/if}
            </div>

        </div>
    {#if !foldOut}
                  <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div class="foldout" on:click={(e) => {foldOut=true}}>
                <Icon name="down"></Icon>
            </div>
    {/if}
    {#if foldOut}
 <button on:click={(e) => { testFirstPass()} }>Test</button>
 <button on:click={(e) => { showStructure()} }>WF JSON</button>

        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class="foldout" on:click={(e) => {foldOut=false}}>
            <Icon name="up"></Icon>
        </div>
        <div class="main">
        <div class="leftMenu">
            {#key state}
                <Icon name="list" {state} on:click={ (e) =>  {state="list" }} ></Icon>
                {#if $metadata && $metadata.lastModified}
                    <Icon name="properties" {state} on:click={async (e) =>  {state="properties" }}  ></Icon>
                    <Icon name="editForm" {state} on:click={async (e) =>  {state="editForm" }}  ></Icon>
                    <Icon name="editRules" {state} on:click={async (e) =>  {state="editRules" }}  ></Icon>
                {:else}
                    <Icon name="properties" deactivate="deactivate"  ></Icon>
                    <Icon name="editForm"   deactivate="deactivate" ></Icon>
                    <Icon name="editRules"   deactivate="deactivate"></Icon>                
                {/if}
            {/key}
        </div>
        <div class="content">

            {#if state === "properties"}
                <h1>Workflow Properties</h1>
                <label for="name">Name:</label><input name="name" type="text" bind:value={name} class="text_input">
                <div class="tagedit">
                    <div class="tagTitle">Click on a Tag to remove it</div>
                    <div class="tags">
                        {#if $metadata.tags}
                            <!-- svelte-ignore a11y-click-events-have-key-events -->
                            {#each $metadata.tags as tag}
                                <div class="tag" on:click={(e) => {removeTag(tag)}}>{tag}</div>
                            {/each}
                        {/if}
                    </div>
                    <select class="tagselect" bind:value={selectedTag} on:change={(e) => {addTag()}}>
                        <option selected value="">Add Tag...</option>
                        {#each tags as tag}
                            {#if $metadata.tags && !$metadata.tags.includes(tag)}
                                <option value="{tag}">{tag}</option>
                            {/if}
                        {/each}
                    </select>
                </div>
                <label for="license">License:</label>
                <select class="input license" name="license" bind:value={$metadata.license}>
                    <option selected value="">Select...</option>
                    <option selected value="yes_commercial">Commercial allowed</option>
                    <option selected value="non_commercial">Non Commercial</option>
                    <option selected value="needs_license">Needs license for Commercial use</option>
                </select>
                <div class="inputLine" >
                    <label for="description" style="vertical-align:top">Description:</label>
                    <textarea class="text_input" bind:value={$metadata.description}></textarea>                    
                </div>
                <div class="inputLine" >
                    <label for="category" style="vertical-align:top">Category (only layer menu):</label>
                    <input type="text" class="text_input" bind:value={$metadata.category}>                 
                </div>
            {/if}
            {#if state === "editForm"}
                <div style="margin-top:10px"></div>
                <FormBuilder></FormBuilder>
            {/if}
            {#if state === "editRules"}
                <div style="margin-top:10px"></div>
                {#if $metadata.forms && $metadata.forms.default && $metadata.forms.default.elements}
                    <RuleEditor></RuleEditor>
                {:else}
                    Please define a form first
                {/if}
            {/if}
            {#if state === "list"}
                <h1>Workflow List</h1>
                <div class="tags">
                    {#each tags as tag}
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <div class="tag"
                            on:click={ (e) => { activatedTags[tag]=!activatedTags[tag];$workflowList=$workflowList}}
                            class:on={activatedTags[tag]}>{tag}</div>
                    {/each}
                </div>
                {#if workflowList}
                    {#each $workflowList as workflow}
                        {#if isVisible(workflow)}
                            <!-- svelte-ignore a11y-click-events-have-key-events -->
                            <div class="workflowEntry" on:click={loadWorkflow(workflow)}>
                                {workflow.name}
                                <div class="last_changed">{workflow.lastModifiedReadable}</div>
                                <div class="tags">
                                    {#if workflow.gyre && workflow.gyre.tags}
                                        {#each workflow.gyre.tags as tag}
                                            <div class="tag">{tag}</div>
                                        {/each}
                                    {/if}
                                </div>
                            </div>
                        {/if}
                    {/each}
                {/if}

            {/if}
        </div>
    </div>
    {/if} <!-- foldOut -->
</div>
<Mappings></Mappings>
<svelte:window on:mouseup={onMouseUp} on:mousemove={onMouseMove}/>
 
<style>
    @import 'dist/build/gyrestyles.css';
</style>