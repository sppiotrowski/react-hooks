import React from "react";
import styled, { css } from "styled-components";
import { useScrollPageY, useClientRect, RectInfo } from "./hooks";

const Wrap = styled.div`
  text-align: center;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid lightgrey;
`;

const PhotoContent = styled(Content)`
  height: 400px;
`;

const DetailsContent = styled(Content)`
  height: 400px;
`;

const FixedTop = css`
  position: fixed;
  top: 0;
  z-index: 1;
  background-color: #fec396;
`;

const FixedBottom = css`
  position: fixed;
  bottom: 0;
  z-index: 1;
  background-color: #fef296;
`;

const PriceHeader = styled(Content)`
  height: 50px;
  width: 100%;
  background-color: #fde1a3;
  ${({ position }) => {
    if (position === "top") {
      return FixedTop;
    } else if (position === "bottom") {
      return FixedBottom;
    }
    return null;
  }}
`;

function App() {
  const [wrapRef, wrapRect] = useClientRect();
  const [
    priceRef,
    priceOffsetFromTop,
    priceOffsetFromBottom,
    priceRect
  ] = useScrollPageY();

  const [photoRef, photoRect] = useClientRect();
  const [detailsRef, detailsRect] = useClientRect();

  const [position, setPosition] = React.useState(null);
  React.useEffect(() => {
    console.log("price.offset.top:", priceOffsetFromTop);
    console.log("price.offset.bottom", priceOffsetFromBottom);
    console.log("");
    if (priceOffsetFromBottom.bottom < 0) {
      setPosition("bottom");
    } else if (priceOffsetFromTop.top < 0) {
      setPosition("top");
    } else {
      setPosition(null);
    }
  }, [priceOffsetFromTop, priceOffsetFromBottom, priceRect]);

  return (
    <Wrap ref={wrapRef}>
      <PhotoContent ref={photoRef}>
        <RectInfo label="photo" rect={photoRect} />
      </PhotoContent>
      <PriceHeader ref={priceRef} position={position}>
        <RectInfo label="price" rect={priceRect} />
      </PriceHeader>
      <DetailsContent ref={detailsRef}>
        <RectInfo label="details" rect={detailsRect} />
      </DetailsContent>
      <div>Wrap.heigh: {wrapRect.height}</div>
      <div>
        {`maxPageYOffset ${wrapRect.height -
          document.documentElement.clientHeight}`}
      </div>
    </Wrap>
  );
}

export default App;
