<script>
    import FormBuilder from "./FormBuilder.svelte"
    import RuleEditor from "./RuleEditor.svelte"
    import {writable} from 'svelte/store'
    import {onMount,beforeUpdate} from 'svelte'
    import {get_all_dirty_from_scope} from "svelte/internal";
    import { metadata} from './stores/metadata'
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
    });


    function addExternalLoadListener(){
        const fileInput = document.getElementById("comfy-file-input");
        const fileInputListener = async () => {
            if (fileInput && fileInput.files && fileInput.files.length > 0) {
                    console.log(fileInput,fileInput.files);
                    new Date(fileInput.files[0].lastModified).toDateString()
                    let fixedfilename = getAvalableFileName(fileInput.files[0].name);
                    let graph = window.app.graph.serialize();
                    graph.name = fixedfilename;
                    graph.lastModified = fileInput.files[0].lastModified
                    if(!graph.extra?.workspace_info) graph.extra.workspace_info =[];
                    graph.extra.workspace_info.name = fixedfilename;
                    graph.extra.workspace_info.lastModified = fileInput.files[0].lastModified;
                    graph.extra.workspace_info.lastModifiedReadable = new Date(fileInput.files[0].lastModified).toISOString().split('T')[0];
                    if(!graph.extra.gyre) {
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
    function getAvalableFileName(name){
        if (!name) return 'new';
        return name;
        let ind = 1;
        let goodname = false;
        let ext = name.split('.').pop();
        name = name.replace(/\.[^/.]+$/, "");
        let newname = name;
        while(!goodname){
            let allcurrnames = allworkflows.map((el)=>el.name);
            if(allcurrnames.includes(name)){
                newname = `${name}(${ind})`;
                ind = ind+1;
            } else {
                goodname = true;
            }
        }
        return  `${newname}`;
    }





    function onMouseUp() {
        moving = false;
    }



    function isVisible(workflow) {
        let mytags = workflow?.gyre?.tags||[];
        for (let activeTag in activatedTags) {
            if (activatedTags[activeTag] && !mytags.includes(activeTag)) return false
        }
        return true
    }




    async function loadList() {
        // todo: make server request and read $metadata of all existing workflows on filesystem
        let result = await scanLocalNewFiles()
        let data_workflow_list = result.map((el)=>{
            let res = {name:el.name}
            let gyre = null;
            if(el.json) gyre = JSON.parse(el.json).extra.gyre;
            res.lastModifiedReadable =  JSON.parse(el.json).extra.gyre?.lastModifiedReadable || "";
            if(gyre){
                res.gyre = gyre;
                res.gyre.lastModifiedReadable =  JSON.parse(el.json).extra.gyre?.lastModifiedReadable || "";
                res.gyre.lastModified =  JSON.parse(el.json).extra.gyre?.lastModified || "";
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
                    path:"",
                    existFlowIds,
                }),
            });
            let  result = await response.json();
            result = fixDatesFromServer(result);
            allworkflows = result;
            return result;
        } catch (error) {
            console.error("Error scan local new files:", error);
        }
    }

    function fixDatesFromServer(result){
        let newel = result.map((el)=>{
            let objjs =  JSON.parse(el.json);
            objjs.extra.gyre.lastModified = new Date(el.lastmodified * 1000).getTime();
            let datestr = new Date(el.lastmodified * 1000).toISOString();
            objjs.extra.gyre.lastModifiedReadable = datestr.split('T')[0]+" "+datestr.split('T')[1].replace(/\.[^/.]+$/, "");
            let json = JSON.stringify(objjs);
            return{...el,json}
        })
        return newel;
    }



    async function loadWorkflow(workflow) {
        await loadList();
        // todo:check if current workflow is unsaved and make confirm otherwise
        // 1. make server request by workflow.name, getting full workflow data here
        // 2. update ComfyUI with new workflow
        // 3. set name and $metadata here
        if(!workflow.gyre){
            workflow.gyre = {};
            workflow.gyre.tags = [];
        }
        console.log("load workflow!!");
        name = workflow.name
        $metadata = workflow.gyre;

        if (window.app.graph == null) {
            console.error("app.graph is null cannot load workflow");
            return;
        }

        let current = allworkflows.find((el)=>{
            return el.name==workflow.name;
        })
        if(!current){
            window.app.loadGraphData(workflow);
        } else {
            let wf =  JSON.parse(current.json);
            if(!wf.name && name) wf.name = name;
            window.app.loadGraphData(wf);
        }
        state="properties"
    }





    async function saveWorkflow() {
                console.log("saveWorkflow");
                let graph = window.app.graph.serialize();
                if(loadedworkflow && loadedworkflow.extra.workspace_info){
                    graph.extra = loadedworkflow.extra;
                    $metadata = loadedworkflow.extra.gyre;
                }
                let file_path =  graph.extra?.workspace_info?.name || "new.json";
                if(name){file_path = name}
                if($metadata){graph.extra.gyre =  $metadata;}
                file_path = file_path || "new.json";
                //file_path = file_path.replace(/\.[^/.]+$/, "");
                if (!file_path.endsWith('.json')) {
                    // Add .json extension if it doesn't exist
                    file_path += '.json';
                }
                if($metadata && graph.extra) graph.extra.gyre =  $metadata;
                const graphJson = JSON.stringify(graph);
                await updateFile(file_path,graphJson);


        // todo:get workflow fom comfyUI
        // $metadata should already point to extras.gyre - so nothing to do here
        // 1. make server request, with  name and full workflow, store it on filesystem there
        // 2. set unsaved state to false
        // 3. load list of all workflows again
        alert("save workflow " + name) // remove
        await loadList();
    }



    async function updateFile(file_path , jsonData ) {
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

    {#if !foldOut}
        <div class="miniMenu">
            <svg on:mousedown={onMouseDown} xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FFF"
                 stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                 id="dragModelManagerTopBarIcon" cursor="move">
                <path d="M9 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                <path d="M9 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                <path d="M9 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                <path d="M15 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                <path d="M15 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                <path d="M15 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
            </svg>
            {#if !name}
                <!-- svelte-ignore a11y-missing-attribute -->
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAdCAMAAACKeiw+AAAC/VBMVEUAAAAfQ1FJNEQ4TVEfPFcsd5MgSGEeSlpzf5c+sMgXia8XT20vgpcmOFEdNU0YYoWjQ2pMT2oganJeLUxZN0BOSlAck/h1hqck5PZQXn0bLEQotdcUGy1H+/8UfKhAgd3qiLc81ugvyN4jd8rpWosnM01EoLFJwc3WcaNYX2Imt8h6e4ZDere3vc2ssb8fgp6ZHVhuc4Ali6JRdp2oWECJkJkJRmtCSVAoQFl4e38mdn1lZ2IkPlqkVP8Hkv8GBRAAh/88YWoNDx1K/v87+f8Bxf8Jff/hkPoNR+//c5MsUFofNkcTGCgBAAVn//9X//8x/P8b7v9a3/8azv8Dp//TgP+aTP+5Rf+wQP8Nzv4f2v2/aP3kmPw74vvJefs12vm42fkBbu7yjOiutdYFQ9Ton9MCM87sWMvuaMrjbsYCJLNUMpEKG3/7V3AfQG8tUWx0AGUnS2M0RlUnQVRvAFMnNFAcLEj/nj4WKDoTHDgWIjUUISz+ww17//828P8z7P8M5//Q5v9q3P/11P8AvP8Asf/lov//nf9Amv//bP+6Tv//Rv+iRf8NVv5H6v1Yz/3SiP2I4fxmtfzYt/vqyvgam/cAgveedve4YPaR0vVp0PRZxPRBxfKySvGhzPBAr/D/c+wHuOsDU+rklOnXaunKWenCheTRRuOTn+I8iOCUzd3lUdz/lNv/ttractq1qNkZltcBZdQXhNI/udGMxtBpqs/Ses3uhMcCYMf/4sLLY8EkYsEGPb0Se7plSbjmVbe2c7bilrUfi7P1abD/S6/rSq1tXKwoQ6z1sKSdTKT0s6Fvf6BLdZ7WZ55pZ54uhJsGHpf4UpXaopMsgpLLAJL6Y4+iAI7jRYvkAInFJoc0eob8aIMcOYJ4IoJDVoD0wX9WJH4RLHjzPnfJPnToXXBNAHCbE2wTJ2lhjmNxoGIgOWGtI2Bhil2aEVSfJFKRC1H/tUyZAEv/g0pnd0hnAEPMnzr/tif/pyb/iSCYiBT/pADmngDSmwDFkQD/jQDNN3N7AAAAPXRSTlMAGRAKk3w3Kdq/lZWNe3FnX0hDQxsV/f36+vr29vLt5+Hg2dHPy8nEw72pmpiTjIyKfXhycW1jYFpXNSQd0lS2vQAAAchJREFUKM9ioCIwUuPRssIpq+8X2yChxIhLmtMvKpCVgRm7JBu7uvOsJjYcWhmNeThdZjazYpcVZdSRXzk/PqFRiIEJizQ/l3JH/6TpSxcsE8Qiyy69d45LQG1C0uL2tSboksyMQnKbXaLmnbz7IPvY+p0qAujmcx9ydk1+9uXtu/clT/dN6dRA851ZrGvQ2Y+5Vz1vP3ldkj25W0EU1WX1rROvP8qY656U4fm44Fzb6jXCyNKsda5bcveHARY9Ic52iefNglVBmSJIsiJbgyNf/lhuG5N6IsZ23cVrB5xXCCBkrbXPTA28/CvdNvRgzalQ28NXdvnPNkC43pSjaLedw89v4bbul1LdbTNvbOuLR7Jb93Rpfprdxj8fwnui42aEHT2SvFAWyWo98cqiOx52O/7WbO+KiEj/dH9DgCKStCVHWZVjjodd4uff38vL/33dFOnPhRyohvecioHybg6Jt968OD+tJVgMJc0wSVbaezk+z+p1c3CwCwlxW4SWKsxLnXyLHfMfXshKS0nZcxwjUnkr7H2rC728CvPyXnlrYsa4RZmPva9Thbd3tY8qtuTExCJV5WRv7yPDiyM1svOxcLPw2RCfbQBuO530bO8cGwAAAABJRU5ErkJggg==">

                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div on:click={(e) => {foldOut=true}} class="title">Gyre</div>
            {:else}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div on:click={(e) => {foldOut=true}} class="title">{name}</div>
                <div style="display: inline-block" class="saveIcon">
                    <svg on:click={(e) => {saveWorkflow()}} xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tabler-icon tabler-icon-device-floppy" aria-hidden="true" focusable="false"><path d="M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2"></path><path d="M12 14m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path><path d="M14 4l0 4l-6 0l0 -4"></path></svg>
                </div>
            {/if}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div class="foldout" on:click={(e) => {foldOut=true}}>
                <svg viewBox="0 0 320 512" xmlns="http://www.w3.org/2000/svg"  width="15" height="15"><path d="M310.6 246.6l-127.1 128C176.4 380.9 168.2 384 160 384s-16.38-3.125-22.63-9.375l-127.1-128C.2244 237.5-2.516 223.7 2.438 211.8S19.07 192 32 192h255.1c12.94 0 24.62 7.781 29.58 19.75S319.8 237.5 310.6 246.6z"/></svg>
            </div>
        </div>
    {/if}
    {#if foldOut}
        <svg on:mousedown={onMouseDown} xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FFF"
             stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="draggableel" cursor="move">
            <path d="M9 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
            <path d="M9 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
            <path d="M9 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
            <path d="M15 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
            <path d="M15 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
            <path d="M15 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
        </svg>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class="foldout" on:click={(e) => {foldOut=false}}>
            <svg viewBox="0 0 320 512" xmlns="http://www.w3.org/2000/svg"  width="15" height="15"><path d="M9.39 265.4l127.1-128C143.6 131.1 151.8 128 160 128s16.38 3.125 22.63 9.375l127.1 128c9.156 9.156 11.9 22.91 6.943 34.88S300.9 320 287.1 320H32.01c-12.94 0-24.62-7.781-29.58-19.75S.2333 274.5 9.39 265.4z"/></svg>
        
        </div>
        {#if $metadata && $metadata.lastModified && state !== "list"}
            <input type="text" bind:value={name} class="text_input">
            <button on:click={(e) => {saveWorkflow()}}>Save</button>
            <br>
            <button style="margin-left:20px" on:click={(e) => {state="list"}}>List</button>
            <button on:click={(e) => {state="properties"}}>Properties</button>
            <button on:click={(e) => {state="editForm"}}>Form Builder</button>
            <button on:click={(e) => {state="editRules"}}>Rules</button>
        {/if}
        {#if state === "properties"}
            <h1>Workflow Properties</h1>
            <div class="tagedit">
                <div class="title">Click on a Tag to remove it</div>
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
                        {#if !$metadata.tags.includes(tag)}
                            <option value="{tag}">{tag}</option>
                        {/if}
                    {/each}
                </select>
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
    {/if} <!-- foldOut -->
</div>
<svelte:window on:mouseup={onMouseUp} on:mousemove={onMouseMove}/>

<style>
  @import 'dist/build/gyrestyles.css';
</style>