import asyncio
import server
from aiohttp import web
import aiohttp
import requests
import folder_paths
import shutil
import os
import sys
import threading
import subprocess  # don't remove this
from urllib.parse import urlparse
import subprocess
import os
import json
from .nodes import *

WEB_DIRECTORY = "entry"
DEFAULT_USER = "guest"
# NODE_CLASS_MAPPINGS = {}
__all__ = ['NODE_CLASS_MAPPINGS']
version = "V1.0.0"

print(f"### Loading: Gyre ({version})")
workspace_path = os.path.join(os.path.dirname(__file__))
comfy_path = os.path.dirname(folder_paths.__file__)
db_dir_path = os.path.join(workspace_path, "db")

workspace_app = web.Application()
dist_path = os.path.join(workspace_path, 'dist/build')
if os.path.exists(dist_path):
    workspace_app.add_routes([
        web.static("/", dist_path),
    ])

server.PromptServer.instance.app.add_subapp("/dist/build/", workspace_app)


def get_my_workflows_dir():
    return os.path.join(comfy_path, 'gyre_workflows')


def get_my_log_dir():
    return os.path.join(comfy_path, 'gyre_logs')

def get_my_debug_dir():
    return os.path.join(comfy_path, 'gyre_debug')

def get_my_formdata_dir():
    return os.path.join(comfy_path, 'gyre_formdata')


@server.PromptServer.instance.routes.post("/workspace/update_json_file")
async def update_json_file(request):
    data = await request.json()
    file_path = data['file_path']
    json_str = data['json_str']

    def write_json_to_file(json_str):
        my_workflows_dir = get_my_workflows_dir()
        full_path = os.path.join(my_workflows_dir, file_path)
        # Create the directory if it doesn't exist
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        with open(full_path, 'w', encoding='utf-8') as file:
            file.write(json_str)

    # Offload the file update to a separate thread
    await asyncio.to_thread(write_json_to_file, json_str)
    return web.Response(text="File updated successfully")

def file_handle(name, file, existFlowIds, fileList,lastmodified):
    json_data = json.load(file)
    fileInfo = {
        'json': json.dumps(json_data),
        'name': '.'.join(name.split('.')[:-1]),
        'lastmodified':lastmodified
    }
    if 'extra' in json_data and 'workspace_info' in json_data['extra'] and 'id' in json_data['extra']['workspace_info']:
        if json_data['extra']['workspace_info']['id'] not in existFlowIds:
            fileList.append(fileInfo)
    else:
        fileList.append(fileInfo)

def folder_handle(path, existFlowIds):
    fileList = []
    # Create the directory if it doesn't exist
    #my_workflows_dir = get_my_workflows_dir()
    #full_path = os.path.join(my_workflows_dir, file_path)
    print(f"###path ({path})") 
    os.makedirs(path, exist_ok=True)
    #my_workflows_dir = get_my_workflows_dir()
    #os.makedirs(os.path.dirname(my_workflows_dir), exist_ok=True)
    for item in os.listdir(path):
        item_path = os.path.join(path, item)
        if os.path.isfile(item_path) and item_path.endswith('.json'):
            lastmodified = os.path.getmtime(item_path)
            with open(item_path, 'r', encoding='utf-8') as f:
                file_handle(item, f, existFlowIds, fileList,lastmodified)

        elif os.path.isdir(item_path):
            fileList.append({
                'name': item,
                'list': folder_handle(item_path, existFlowIds)
            })
    return fileList



# Scan all files and subfolders in the local save directory.
# For files, compare the extra.workspace_info.id in the json format file with the flow of the current DB to determine whether it is a flow that needs to be added;
# For subfolders, scan the json files in the subfolder and use the same processing method as the file to determine whether it is a flow that needs to be added;
@server.PromptServer.instance.routes.post("/workspace/readworkflowdir")
async def readworkflowdir(request):
    reqJson = await request.json()
    type = None
    if ('type' in reqJson): type = reqJson['type']
    print("load directory type")
    print(type)
    path = None
    if (type and type=='logs'):
        path = get_my_log_dir()
    elif  (type and type=='debugs'):
        path = get_my_debug_dir()
    elif  (type and type=='formdata'):
        path = get_my_formdata_dir()
    else:
        path = get_my_workflows_dir()
    print("path")
    print(path)
    existFlowIds = reqJson['existFlowIds']

    fileList = folder_handle(path, existFlowIds)
    return web.Response(text=json.dumps(fileList), content_type='application/json')



@server.PromptServer.instance.routes.get("/workspace/readworkflowdir")
async def readworkflowdir(request):
    path = get_my_workflows_dir()
    fileList = folder_handle(path, [])
    return web.Response(text=json.dumps(fileList), content_type='application/json')


@server.PromptServer.instance.routes.post("/workspace/delete_workflow_file")
async def delete_workflow_file(request):
    data = await request.json()
    file_path = data['file_path']

    def delete_file_sync(file_path):
        my_workflows_dir = get_my_workflows_dir()
        full_path = os.path.join(my_workflows_dir, file_path)

        if os.path.exists(full_path):
            os.remove(full_path)
            directory = os.path.dirname(full_path)
            return "Deleted success"
        else:
            return "File was not found"

    response_text = await asyncio.to_thread(delete_file_sync, file_path)

    if response_text == "File not found":
        return web.Response(text=response_text, status=404)
    else:
        return web.Response(text=response_text)

@server.PromptServer.instance.routes.post("/workspace/rename_workflowfile")
async def rename_workflowfile(request):
    data = await request.json()
    file_path = data['file_path']
    new_name = data['new_file_path']
    path = get_my_workflows_dir()

    file_path_full = os.path.join(path, file_path)
    new_name_path_full = os.path.join(path, new_name)

    if os.path.exists(file_path_full):
        os.rename(file_path_full,new_name_path_full)
        return web.Response(text="Renamed successfully")
    else:
        return web.Response(text="Not found", status=404)


@server.PromptServer.instance.routes.post("/workspace/upload_log_json_file")
async def upload_log_json_file(request):
    data = await request.json()
    file_path = data['file_path']
    json_str = data['json_str']
    debug_dir = None
    if ('debugdir' in data): debug_dir = data['debugdir']
    def write_json_to_file(json_str,debug_dir):
        if debug_dir and debug_dir=='formdata':
            my_workflows_dir = get_my_formdata_dir()
        elif debug_dir:
            my_workflows_dir = get_my_debug_dir()
        else:
            my_workflows_dir = get_my_log_dir()

        full_path = os.path.join(my_workflows_dir, file_path)
        # Create the directory if it doesn't exist
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        with open(full_path, 'w', encoding='utf-8') as file:
            file.write(json_str)

    # Offload the file update to a separate thread
    await asyncio.to_thread(write_json_to_file, json_str,debug_dir)
    return web.Response(text="File log updated successfully")
