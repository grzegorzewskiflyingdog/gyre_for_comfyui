export class workflowStructurePass {


   getGroup(node, groups) {
    return groups.find(group => {
      const [gx, gy, gWidth, gHeight] = group.bounding;
      const [nx, ny] = node.pos;
      return nx >= gx && nx <= gx + gWidth && ny >= gy && ny <= gy + gHeight;
    });
  }
  
   duplicateGroup(workflow, groupName = "controlnet", numDuplicates) {
    let maxNodeId = workflow.last_node_id;
    let maxLinkId = workflow.last_link_id;
  
    // Identify the original groups to be duplicated based on groupName
    const originalGroups = workflow.groups.filter(group => group.title.includes(groupName));
    const newGroups = [];
  
    // Duplicate nodes and links for each group
    for (let i = 0; i < numDuplicates; i++) {
      originalGroups.forEach(group => {
        // Create a new group with updated title
        const newGroup = JSON.parse(JSON.stringify(group));
        newGroup.title = `${groupName}[${i + 1}]`;
        newGroup.bounding[0] += i * (newGroup.bounding[2] + 10); // Shift the new group to avoid overlap
        newGroups.push(newGroup);
  
        // Duplicate nodes within this group
        workflow.nodes.forEach(node => {
          if (this.getGroup(node, [group])) {
            const newNode = JSON.parse(JSON.stringify(node));
            newNode.id = ++maxNodeId;
            newNode.pos[0] += i * (group.bounding[2] + 10); // Shift the new node to align with the new group
            workflow.nodes.push(newNode);
  
            // Duplicate internal links
            workflow.links.forEach(link => {
              if (link.from === node.id || link.to === node.id) {
                const newLink = JSON.parse(JSON.stringify(link));
                newLink.id = ++maxLinkId;
                if (newLink.from === node.id) newLink.from = newNode.id;
                if (newLink.to === node.id) newLink.to = newNode.id;
                workflow.links.push(newLink);
              }
            });
          }
        });
      });
    }
  
    // Add duplicated groups to the workflow
    workflow.groups = workflow.groups.concat(newGroups);
  
    // Update last_node_id and last_link_id
    workflow.last_node_id = maxNodeId;
    workflow.last_link_id = maxLinkId;
  
    return workflow;
  }
  
      
}