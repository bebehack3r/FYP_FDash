import styled from 'styled-components';

export const Wrap = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

export const Block = styled.div`
  display: flex;
  flex-direction: column;
  height: 60vh;
  width: 100vw;
  position: relative;
  color: white;
  text-align: center;
  // Add other common styles here
`;

export const Row = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: space-evenly;
  // Add other common styles here
`;

export const Column = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  // Add other common styles here
`;


export default {
  Wrap,
  Block,
  Row,
};
