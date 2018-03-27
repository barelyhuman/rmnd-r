import React from "react";
import Button from "./button";
import Text from "./text";

export default function Panel(props) {
  const len = props.dataList.length;
  const listOfTextElms = props.dataList.map((item, index) => (
    <div key={item.id} className="panel">
      <Text value={item.value} slice={item.marked} />
      <div className="btn-container">
        {!item.marked ? (
          <Button onClick={() => props.mark(index)}>
            <span className="oi" data-glyph="check" />
          </Button>
        ) : (
          <Button onClick={() => props.unMark(index)}>
            <span className="oi" data-glyph="x" />
          </Button>
        )}
        <Button onClick={() => props.remove(index)}>
          <span className="oi" data-glyph="trash" />
        </Button>
      </div>
    </div>
  ));
  return <div className="panel-container">{listOfTextElms}</div>;
}
