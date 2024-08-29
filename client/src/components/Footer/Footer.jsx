import { Container, Row, Col } from "react-bootstrap";
import "./Footer.scss";
export default function Footer() {
  return (
    <Container id="footer">
      <Row>
        <Col>
          <div className="text-center footer">
            <a
              href="https://github.com/project3-AAC"
              target="_blank"
              className="footer"
            >
              Broca's Basilisk © 2024
            </a>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
