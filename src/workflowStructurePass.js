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
  
  
    this.workflow.nodes.forEach(node => {
      if (this.isNodeInGroup(node.id)) {
        const newNode = JSON.parse(JSON.stringify(node));
        newNode.id = ++maxNodeId;
        nodeMapping[node.id] = newNode.id;
        newNode.pos[0]+=1000
        // Initialize or clear the outputs array for the new node
        newNode.outputs = newNode.outputs.map(output => {
          const newOutput = {...output, links: []}; // Prepare to populate with new link IDs
          return newOutput;
        });
    
        this.workflow.nodes.push(newNode);
      }
    });
    
    // After nodes have been duplicated, duplicate links and update outputs accordingly
    this.workflow.links.forEach(link => {
      const [linkID, fromNodeID, fromSlot, toNodeID, toSlot, type] = link;
      if (nodeMapping[fromNodeID] && nodeMapping[toNodeID]) {
        const newLinkID = ++maxLinkId;
        const newLink = [newLinkID, nodeMapping[fromNodeID], fromSlot, nodeMapping[toNodeID], toSlot, type];
        this.workflow.links.push(newLink);
    
        // Update outputs for the new source node
        const newFromNode = this.workflow.nodes.find(n => n.id === nodeMapping[fromNodeID]);
        if (newFromNode && newFromNode.outputs && newFromNode.outputs[fromSlot]) {
          newFromNode.outputs[fromSlot].links.push(newLinkID);
        }
      }
    });
    
  
  
    // Update the workflow's metadata
    this.workflow.last_node_id = maxNodeId;
    this.workflow.last_link_id = maxLinkId;
  }
  
      
}