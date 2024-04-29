import { Navbar, Nav, NavDropdown, Dropdown, Container, Table } from 'react-bootstrap';

import projects from '../config/projects.json';
import aggregated from '../generated/projects.json';

function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function App() {
  const latestSummary = aggregated[aggregated.length - 1];

  const totalStatSize = latestSummary.summary.reduce((total, project) => total + project.statSize, 0);
  const totalParsedSize = latestSummary.summary.reduce((total, project) => total + project.parsedSize, 0);
  const totalGzipSize = latestSummary.summary.reduce((total, project) => total + project.gzipSize, 0);

  return (
    <div id="main-content">
      <Navbar expand="lg" className="bg-light">
        <Container>
          <Navbar.Brand href="#">Bundle Analyser</Navbar.Brand>
          <Navbar>
            <Nav className="me-auto">
              <NavDropdown title="Overview">
                <Dropdown.Item>Overview</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Header>Projects</Dropdown.Header>
                {projects.map((project) => (
                  <Dropdown.Item key={project}>{project}</Dropdown.Item>
                ))}
              </NavDropdown>
            </Nav>
          </Navbar>
        </Container>
      </Navbar>
      <main>
        <Container>
          <Table className="stats-table" bordered hover>
            <thead>
              <tr>
                <th>Project</th>
                <th>statSize</th>
                <th>parsedSize</th>
                <th>gzipSize</th>
              </tr>
            </thead>
            <tbody>
              {latestSummary.summary.map((project) => (
                <tr key={project.name}>
                  <td>{project.name}</td>
                  <td>{formatBytes(project.statSize)}</td>
                  <td>{formatBytes(project.parsedSize)}</td>
                  <td>{formatBytes(project.gzipSize)}</td>
                </tr>
              ))}
              <tr>
                <td><strong>Total</strong></td>
                <td><strong>{formatBytes(totalStatSize)}</strong></td>
                <td><strong>{formatBytes(totalParsedSize)}</strong></td>
                <td><strong>{formatBytes(totalGzipSize)}</strong></td>
              </tr>
            </tbody>
          </Table>
        </Container>
      </main>
    </div>
  );
}

export default App;
