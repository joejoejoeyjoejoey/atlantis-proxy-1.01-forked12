

let wispServer = "wss://anura.pro/"
        
        const connection = new BareMux.BareMuxConnection("/sail/baremux/worker.js") // you could always use epoxy, but libcurl is better imo
        connection.setTransport("/sail/libcurl/index.mjs", [{ websocket: wispServer }]) // use some other wisp here

        const frame = document.getElementById("frame")
        const bar = document.getElementById("bar")

        const { ScramjetController } = $scramjetLoadController()
        const scramjet = new ScramjetController({
            files: {
                all: "/sail/scram/scramjet.all.js",
                wasm: "/sail/scram/scramjet.wasm.wasm",
                sync: "/sail/scram/scramjet.sync.js"
            },
            prefix: "/sail/go/" // feel free to change this later
        })

        scramjet.init()