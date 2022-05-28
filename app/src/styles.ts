import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
`;

export const ButtonContainer = styled.TouchableOpacity`
  width: 50%;
  height: 40px;
  padding: 5px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #5ced73;
`;

export const Scroll = styled.ScrollView`
  position: absolute;
  left: 0;
  bottom: 0;
`;
