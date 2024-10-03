export default {
	async fetch(request, env, ctx) {
	  try {
	    const url = new URL(request.url);

	    if (url.pathname === "/") {
	      return new Response(`{"usage": "${url.origin}/<url>"}`);
	    }

	    function addHeaders(response) {
	      response.headers.set("Access-Control-Allow-Origin", "*");
	      response.headers.set("Access-Control-Allow-Credentials", "true");
	      response.headers.set("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
	      response.headers.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
	    }
	    
	    let response;
	    if (request.method == "OPTIONS") {
	      response = new Response("");
	      addHeaders(response);
	      return response;
	    }

	    response = await fetch(request.url.slice(url.origin.length + 1), {
	        method: request.method,
	        headers: request.headers,
	        redirect: "follow",
	        body: request.body
	    });
	    response = new Response(response.body, response)
	    addHeaders(response);
	    return response;
	  } catch (e) {
	    return new Response(e.stack || e, {status: 500});
	  }
	},
};
