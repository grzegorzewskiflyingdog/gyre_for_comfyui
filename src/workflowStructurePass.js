export class workflowStructurePass {


     duplicateGroup(workflow, groupName = "controlnet", numDuplicates) {
        let maxNodeId = workflow.last_node_id;
        let maxLinkId = workflow.last_link_id;
        const groupPrefix = `${groupName}[`;

        // Helper function to find max ID for nodes and links
        const updateMaxIds = (nodeOrLink) => {
          if (nodeOrLink.id > maxNodeId) maxNodeId = nodeOrLink.id;
          if (nodeOrLink.connections) {
            nodeOrLink.connections.forEach(conn => {
              if (conn.id > maxLinkId) maxLinkId = conn.id;
            });
          }
        };
      
        // Correcting group names and finding max IDs
        workflow.nodes.forEach(node => {
          if (node.group && node.group.startsWith(groupPrefix)) {
            node.group = `${groupName}[0]`;
          }
          updateMaxIds(node);
        });
      
        // Duplication process
        for (let i = 1; i <= numDuplicates; i++) {
          const nodesToDuplicate = workflow.nodes.filter(node => node.group === `${groupName}[0]`);
          nodesToDuplicate.forEach(originalNode => {
            const newNode = JSON.parse(JSON.stringify(originalNode)); // Deep clone
            newNode.id = ++maxNodeId;
            newNode.group = `${groupName}[${i}]`;
            newNode.connections = newNode.connections.map(conn => {
              const newConn = { ...conn, id: ++maxLinkId };
              // Only duplicate internal connections
              if (workflow.nodes.some(node => node.id === conn.node && node.group === newNode.group)) {
                return newConn;
              }
              return conn;
            });
            workflow.nodes.push(newNode);
          });
        }
      
        // Update the last_node_id and last_link_id
        workflow.last_node_id = maxNodeId;
        workflow.last_link_id = maxLinkId;
      
        return workflow;
      }
      
}