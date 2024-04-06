<script>
  import WorkflowManager from "./WorkflowManager.svelte";
  import CE_LayerStack3D from "./CE_LayerStack3D.svelte"
  customElements.define('fds-layer-stack-3d', CE_LayerStack3D);

  if(customElements.get('fds-layer-stack-3d') === undefined) 	console.log('custom element not defined')
  console.log(customElements.get('fds-layer-stack-3d'))
</script>

<WorkflowManager></WorkflowManager>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>