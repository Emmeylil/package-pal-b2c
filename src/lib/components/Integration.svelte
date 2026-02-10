<section id="integration" class="bg-gray-900 py-16 text-white">
    <div
        class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-12"
    >
        <div class="md:w-1/2">
            <span
                class="text-jumia-orange font-bold uppercase tracking-wide text-sm"
                >For Developers & Tech Teams</span
            >
            <h2 class="text-3xl font-extrabold mt-2 mb-4">
                Seamless API Integration
            </h2>
            <p class="text-gray-300 text-lg mb-6">
                Connect your e-commerce store directly to Jumia Delivery.
                Automate order creation, retrieve shipping rates, and fetch
                tracking updates without leaving your system.
            </p>
            <ul class="space-y-3 mb-8">
                <li class="flex items-center gap-3">
                    <svg
                        class="w-5 h-5 text-green-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        ><path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M5 13l4 4L19 7"
                        ></path></svg
                    >
                    <span>RESTful API Architecture</span>
                </li>
                <li class="flex items-center gap-3">
                    <svg
                        class="w-5 h-5 text-green-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        ><path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M5 13l4 4L19 7"
                        ></path></svg
                    >
                    <span>Webhooks for Delivery Status</span>
                </li>
                <li class="flex items-center gap-3">
                    <svg
                        class="w-5 h-5 text-green-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        ><path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M5 13l4 4L19 7"
                        ></path></svg
                    >
                    <span>Sandbox Environment for Testing</span>
                </li>
            </ul>
            <a
                href="/"
                class="text-white border border-gray-600 px-6 py-3 rounded hover:bg-gray-800 transition inline-block"
                >View API Documentation</a
            >
        </div>
        <div
            class="md:w-1/2 bg-gray-800 rounded-lg p-6 font-mono text-sm text-green-400 shadow-2xl border border-gray-700 w-full overflow-hidden"
        >
            <div class="flex gap-2 mb-4 border-b border-gray-700 pb-2">
                <div class="w-3 h-3 rounded-full bg-red-500"></div>
                <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div class="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <p class="text-gray-500"># Create a shipment via API</p>
            <p><span class="text-purple-400">POST</span> /api/v1/shipments</p>
            <p>&#123;</p>
            <p class="pl-4">"recipient": &#123;</p>
            <p class="pl-8">"name": "Ibrahim Musa",</p>
            <p class="pl-8">"phone": "+23480...",</p>
            <p class="pl-8">"city": "Lagos"</p>
            <p class="pl-4">&#125;,</p>
            <p class="pl-4">"package": &#123;</p>
            <p class="pl-8">"weight": 2.5,</p>
            <p class="pl-8">"cod_amount": 15000</p>
            <p class="pl-4">&#125;</p>
            <p>&#125;</p>
            <p class="mt-4 text-white">
                Status: <span class="text-green-400">201 Created</span>
            </p>
        </div>
    </div>
</section>
