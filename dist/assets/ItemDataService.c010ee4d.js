import{h as e}from"./index.06ab4907.js";var t=new class{getAll(){return e.get("/items")}get(t){return e.get(`/items/${t}`)}create(t){return e.post("/items",t)}update(t,r){return e.put(`/items/${t}`,r)}delete(t){return e.delete(`/items/${t}`)}};export{t as I};