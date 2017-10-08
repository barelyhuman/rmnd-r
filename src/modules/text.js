import React from "react";

export default function Text(props){
    return(
        <div className={`text ${props.slice?'marked':''}`}>{props.value}</div>
    );
}