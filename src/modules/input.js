import React from "react";

export default function Input(props){
    return(
        <input id={props.elid} className="input" onChange={props.onChange} onKeyPress={props.keyPress} placeholder={props.placeholder} value={props.value}/>
    );
}