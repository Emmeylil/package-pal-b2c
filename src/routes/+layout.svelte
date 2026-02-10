<script>
  import "../app.css";
  import { app } from "$lib/firebase";
  let { children } = $props();

  console.log("Firebase initialized:", app.name);
</script>

{@render children()}
