export default function UpcomingEventPage() {

    return (

        <div className="min-h-screen w-full bg-gray-50">
            <div className="px-6 md:px-8 py-12 md:py-16">
                <div className="max-w-7xl mx-auto">

                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-10">
                        <a href="/events" className="hover:text-red-600 transition">
                        Events
                        </a>
                        <span className="text-gray-400"> › </span>
                        <span className="text-gray-900 font-medium">
                        Spring Coding Competition 2026
                        </span>
                    </div>

                    {/* Image Placeholder */}
                    <div className="relative w-full h-96 bg-gradient-to-br from-red-600 to-red-800 mb-12">
                        <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-24 h-24 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12"> 
                        <div className="lg:cols-span-2">
                            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900">
                                Spring Coding 
                                <br/>
                                Competition 2026
                            </h1>

                            <div className="flex flex-wrap items-center gap-8 mt-8 text-sm text-gray-500">
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-red-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 10h16m-8-3V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Zm3-7h.01v.01H8V13Zm4 0h.01v.01H12V13Zm4 0h.01v.01H16V13Zm-8 4h.01v.01H8V17Zm4 0h.01v.01H12V17Zm4 0h.01v.01H16V17Z"/>
                                    </svg>
                                    <span>March 14-16, 2026</span>
                                </div>
                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    )
}