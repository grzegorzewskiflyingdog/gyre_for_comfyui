export class workflowStructurePass {

    constructor(workflow) {
      this.workflow=workflow
    }

   getGroup(node, groups) {
    return groups.find(group => {
      const [gx, gy, gWidth, gHeight] = group.bounding;
      const [nx, ny] = node.pos;
      return nx >= gx && nx <= gx + gWidth && ny >= gy && ny <= gy + gHeight;
    });
  }
  getNodeById( nodeId) {
    return this.workflow.nodes.find(node => node.id === nodeId)
  }
   getGroupByName( groupName) {
    return this.workflow.groups.find(group => group.title === groupName)
  }
   isNodeInGroup( nodeId) {
    const node = this.getNodeById(nodeId)
    if (!node) return false; // Node not found
    
    return this.workflow.groups.some(group => {
      const [gx, gy, gWidth, gHeight] = group.bounding;
      const [nx, ny] = node.pos;
      return nx >= gx && nx <= gx + gWidth && ny >= gy && ny <= gy + gHeight;
    })
  }
   updateNodeLinks() {
    // Step 1: Clear existing link IDs from inputs and outputs
    this.workflow.nodes.forEach(node => {
      if (node.inputs) {
        node.inputs.forEach(input => {
          input.link = null;
        });
      }
      if (node.outputs) {
        node.outputs.forEach(output => {
          output.links = [];
        });
      }
    });
  
    // Step 2: Iterate over links to update inputs and outputs
    this.workflow.links.forEach(link => {
      const [linkID, fromNodeID, fromSlot, toNodeID, toSlot, type] = link;
      const fromNode = this.workflow.nodes.find(node => node.id === fromNodeID);
      const toNode = this.workflow.nodes.find(node => node.id === toNodeID);
  
      if (fromNode && fromNode.outputs && fromNode.outputs[fromSlot]) {
        if (!fromNode.outputs[fromSlot].links) {
          fromNode.outputs[fromSlot].links = [];
        }
        fromNode.outputs[fromSlot].links.push(linkID);
      }
  
      if (toNode && toNode.inputs && toNode.inputs[toSlot]) {
        toNode.inputs[toSlot].link = linkID;
      }
    });
  }
  
  
   duplicateGroupWithNodesAndLinks(groupName) {
    // Assuming getGroupByName and isNodeInGroup functions are defined elsewhere
    const originalGroup = this.getGroupByName( groupName);
    if (!originalGroup) return; // Exit if group not found
    console.log("# nodes",this.workflow.nodes.length)

    let maxNodeId = this.workflow.last_node_id;
    let maxLinkId = this.workflow.last_link_id;
    
    // Duplicate group
    const newGroup = JSON.parse(JSON.stringify(originalGroup))
    newGroup.title += " Copy"; // Adjust the group title
    newGroup.bounding[0] += 1000; // Shift the new group to prevent overlap
    this.workflow.groups.push(newGroup);
  
    const nodeMapping = {}; // Map old node IDs to new node IDs
  
    // Duplicate nodes
    this.workflow.nodes.forEach(node => {
      if (this.isNodeInGroup(node.id)) {
        const newNode = JSON.parse(JSON.stringify(node));
        newNode.id = ++maxNodeId;
        newNode.pos[0]+=1000
        nodeMapping[node.id] = newNode.id; // Map old ID to new ID
        this.workflow.nodes.push(newNode);
        console.log("add node",newNode)
      }
    });
  
    this.workflow.links.forEach(link => {
      const [linkID, fromNodeID, fromSlot, toNodeID, toSlot, type] = link; // Destructure the original link array
      // Check if both source and target nodes are within the group being duplicated
      if (nodeMapping[fromNodeID] && nodeMapping[toNodeID]) {
        // Create a new link for the duplicated nodes
        const newLink = [
          ++maxLinkId, // Assign a new unique ID for the link
          nodeMapping[fromNodeID], // Map old source node ID to new
          fromSlot, // Preserve the original fromSlot
          nodeMapping[toNodeID], // Map old target node ID to new
          toSlot, // Preserve the original toSlot
          type // Preserve the link type
        ];
        this.workflow.links.push(newLink); // Add this new link to the workflow
      }
    });
  
    this.updateNodeLinks()
    // Update the workflow's metadata
    this.workflow.last_node_id = maxNodeId;
    this.workflow.last_link_id = maxLinkId;
  }
  
      
}