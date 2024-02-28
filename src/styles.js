export let stylestr =`.workflowManager {
    z-index: 200;
    position: fixed;
    left: 10px;
    top: 10px;
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", sans-serif, "Segoe UI", Helvetica, Arial;
    padding: 10px;
    background-color: rgb(0, 0, 0);
    color: white;
    width: 490px;
    display: block;
    border-radius: 5px
}

.miniMenu .title {
    display: inline-block;
    cursor: pointer;
}

.tagedit .title {
    margin-bottom: 10px;
}

.tagedit .tag:hover {
    background-color: red;
}

.tagedit .tagselect:focus {
    outline: none;
}

.tagedit .tagselect {
    background-color: grey;
    font-size: 15px;
    color: white;
    border: none;
    margin-top: 10px;
}

.foldout {
    position: absolute;
    right: 5px;
    top: 5px;
    font-size: 20px;
    cursor: pointer;
}

.foldout:hover {
    color: rgb(227, 206, 116);
}

.tags {
    user-select: none;
}

.workflowManager button {
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

.workflowManager button:hover {
    background-color: #ddb74f;

}

.workflowEntry {
    border: 1px solid grey;
    border-radius: 3px;
    margin-bottom: 10px;;
    padding: 5px;
    cursor: pointer;
}

.workflowEntry .last_changed {
    margin-top: 5px;
    font-size: 12px;
}

.workflowEntry:hover {
    background-color: #ddb74f;
    color: black;
}

.workflowEntry .tags {
    margin-top: 5px;
}

.tag {
    display: inline-block;
    background-color: dimgray;
    margin-right: 5px;
    margin-bottom: 5px;
    padding: 5px;
    cursor: pointer;
    font-size: 12px;
}

.on {
    background-color: #ddb74f;
    color: black;
}

.workflowEntry .tag {
    font-size: 12px;
    margin-right: 5px;
    margin-bottom: 5px;
    padding: 5px;
    opacity: 0.6;
}

.workflowManager h1 {
    font-size: 18px;
}

.text_input {
    background: transparent;
    border: 1px solid white;
    color: white;
    width: 300px;
}
.saveIcon {
    vertical-align: -5px;
}

html, body {
    position: relative;
    width: 100%;
    height: 100%;
}

body {
    color: #333;
    margin: 0;
    padding: 8px;
    box-sizing: border-box;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
}

a {
    color: rgb(0,100,200);
    text-decoration: none;
}

a:hover {
    text-decoration: underline;
}

a:visited {
    color: rgb(0,80,160);
}

label {
    display: block;
}

input, button, select, textarea {
    font-family: inherit;
    font-size: inherit;
    -webkit-padding: 0.4em 0;
    padding: 0.4em;
    margin: 0 0 0.5em 0;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 2px;
}

input:disabled {
    color: #ccc;
}

button {
    color: #333;
    background-color: #f4f4f4;
    outline: none;
}

button:disabled {
    color: #999;
}

button:not(:disabled):active {
    background-color: #ddd;
}

button:focus {
    border-color: #666;
}
`;