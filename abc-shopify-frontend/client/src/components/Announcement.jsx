import styled from "styled-components";

const Announcement = () => {
  return (
    <Container>Super Deal! Free delivery on Orders Over Rs.5000</Container>
  );
};

export default Announcement;

const Container = styled.div`
  height: 30px;
  background-color: #f5c71a;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
`;
