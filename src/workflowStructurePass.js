export class workflowStructurePass {

  constructor(workflow) {
    this.workflow = workflow
    this.nodeMapping = {}
  }

  getGroup(node, groups) {
    return groups.find(group => {
      const [gx, gy, gWidth, gHeight] = group.bounding;
      const [nx, ny] = node.pos;
      return nx >= gx && nx <= gx + gWidth && ny >= gy && ny <= gy + gHeight;
    });
  }
  getNodeById(nodeId) {
    return this.workflow.nodes.find(node => node.id === nodeId)
  }
  getGroupByName(groupName) {
    return this.workflow.groups.find(group => group.title === groupName)
  }
  isNodeInGroup(nodeId, groupName) {
    const node = this.workflow.nodes.find(n => n.id === nodeId);
    if (!node) return false; // Node not found

    const group = this.workflow.groups.find(group => group.title === groupName && group.bounding);
    if (!group) return false; // Group not found

    const [gx, gy, gWidth, gHeight] = group.bounding;
    const [nx, ny] = node.pos;
    return nx >= gx && nx <= gx + gWidth && ny >= gy && ny <= gy + gHeight;
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

  // Gyre loops: reroute end loop link and make new link between groups
  adjustLinksForSpecialNodes(groupName) {
    // Assuming `this.nodeMapping` maps original node IDs to their new duplicated IDs
    const gyreLoopEndNodes = this.workflow.nodes.filter(node => node.type === "GyreLoopEnd").map(node => node.id);

    const linksToRemove = [];
    const newLinks = [];
    this.workflow.links.forEach(link => {
      const [linkID, fromNodeID, fromSlot, toNodeID, toSlot, type] = link;

      if (gyreLoopEndNodes.includes(toNodeID) && this.isNodeInGroup(fromNodeID, groupName)) {
        // Mark this link for removal
        linksToRemove.push(linkID);
        // Create a new link from the cloned node to the "GyreLoopEnd" node
        const newLink = [this.workflow.last_link_id + 1, this.nodeMapping[fromNodeID], fromSlot, toNodeID, toSlot, type];
        newLinks.push(newLink);
        this.workflow.last_link_id++;
      }
    });

    // Remove identified links
    this.workflow.links = this.workflow.links.filter(link => !linksToRemove.includes(link[0]));

    // Add new links
    this.workflow.links.push(...newLinks);
  }

  duplicateGroupWithNodesAndLinks(groupName) {
    // Assuming getGroupByName and isNodeInGroup functions are defined elsewhere
    const originalGroup = this.getGroupByName(groupName);
    if (!originalGroup) return; // Exit if group not found
    console.log("# nodes", this.workflow.nodes.length)

    let maxNodeId = this.workflow.last_node_id;
    let maxLinkId = this.workflow.last_link_id;

    // Duplicate group
    const newGroup = JSON.parse(JSON.stringify(originalGroup))
    newGroup.title += " Copy"; // Adjust the group title
    newGroup.bounding[0] += 1000; // Shift the new group to prevent overlap
    this.workflow.groups.push(newGroup);

    this.nodeMapping = {}; // Map old node IDs to new node IDs

    // Duplicate nodes
    this.workflow.nodes.forEach(node => {
      if (this.isNodeInGroup(node.id, groupName)) {
        const newNode = JSON.parse(JSON.stringify(node));
        newNode.id = ++maxNodeId;
        newNode.pos[0] += 1000
        this.nodeMapping[node.id] = newNode.id; // Map old ID to new ID
        this.workflow.nodes.push(newNode);
        console.log("add node", newNode)
      }
    });

    this.workflow.links.forEach(link => {
      const [linkID, fromNodeID, fromSlot, toNodeID, toSlot, type] = link; // Destructure the original link array
      // Check if both source and target nodes are within the group being duplicated
      if (this.nodeMapping[fromNodeID] && this.nodeMapping[toNodeID]) {
        // Create a new link for the duplicated nodes
        const newLink = [
          ++maxLinkId, // Assign a new unique ID for the link
          this.nodeMapping[fromNodeID], // Map old source node ID to new
          fromSlot, // Preserve the original fromSlot
          this.nodeMapping[toNodeID], // Map old target node ID to new
          toSlot, // Preserve the original toSlot
          type // Preserve the link type
        ];
        this.workflow.links.push(newLink); // Add this new link to the workflow
      }
    });

    // outside links going inside group nodes duplication
    this.workflow.links.forEach(link => {
      const [linkID, fromNodeID, fromSlot, toNodeID, toSlot, type] = link
      const fromNode = this.workflow.nodes.find(node => node.id === fromNodeID)
      const toNode = this.workflow.nodes.find(node => node.id === toNodeID)

      // Check if the toNode is inside the group and fromNode is outside and not of specific types
      if (this.isNodeInGroup(toNodeID, groupName) && !this.isNodeInGroup(fromNodeID, groupName) &&
        fromNode.type !== 'GyreLoopStart' && fromNode.type !== 'GyreLoopEnd') {
        // Logic to duplicate the link here
        const newLinkID = ++maxLinkId; // Increment and assign new max link ID
        const newLink = [newLinkID, fromNodeID, fromSlot, this.nodeMapping[toNodeID], toSlot, type]
        this.workflow.links.push(newLink)
      }
    })
    this.workflow.last_link_id = maxLinkId
   this.adjustLinksForSpecialNodes(groupName)
    maxLinkId = this.workflow.last_link_id

    this.updateNodeLinks()
    // Update the workflow's metadata
    this.workflow.last_node_id = maxNodeId
    this.workflow.last_link_id = maxLinkId
  }


}