import React from "react";

export default function Button(props){
    return(
        <div className="btn" onClick={props.onClick}>
            {props.children}
        </div>
    );
}