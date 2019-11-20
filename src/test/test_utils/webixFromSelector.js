

const webixFromSelector = (selector)=>{

    let result = null;
    const element = document.querySelector(selector);

    if(element){
        const view_id = element.getAttribute('view_id');
        result = !!view_id ? $$(view_id) : null;
    }

    return result;

}

export default webixFromSelector;