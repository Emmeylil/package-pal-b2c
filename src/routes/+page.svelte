<script>
    import Navbar from "$lib/components/Navbar.svelte";
    import Hero from "$lib/components/Hero.svelte";
    import Features from "$lib/components/Features.svelte";
    import Integration from "$lib/components/Integration.svelte";
    import PickupStations from "$lib/components/PickupStations.svelte";
    import Stats from "$lib/components/Stats.svelte";
    import Footer from "$lib/components/Footer.svelte";
</script>

<Navbar />
<main>
    <Hero />
    <Features />
    <PickupStations />
    <Stats />
</main>
<Footer />
