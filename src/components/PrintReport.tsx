"use client"

import type React from "react"
import { Button } from "antd"
import { PrinterOutlined } from "@ant-design/icons"

interface PrintReportProps {
  data: any
  title?: string
  type?: "interview" | "candidate" | "analytics"
  candidateName?: string
  jobTitle?: string
  companyName?: string
}

const PrintReport: React.FC<PrintReportProps> = ({ 
  data, 
  title = "Reporte", 
  type = "interview",
  candidateName,
  jobTitle,
  companyName
}) => {
  const handlePrint = () => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const printContent = generatePrintContent(data, title, type)

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { 
              font-family: 'Segoe UI', 'Inter', Arial, sans-serif; 
              margin: 0; 
              padding: 0; 
              color: #1a1a1a;
              line-height: 1.6;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            .container {
              max-width: 800px;
              margin: 0 auto;
              background: white;
              min-height: 100vh;
              box-shadow: 0 0 20px rgba(0,0,0,0.1);
            }
            .header { 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              text-align: center; 
              padding: 40px 30px;
              position: relative;
              overflow: hidden;
            }
            .header::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
              opacity: 0.3;
            }
            .header-content {
              position: relative;
              z-index: 1;
            }
            .logo { 
              font-size: 32px; 
              font-weight: 800; 
              color: white; 
              margin-bottom: 15px; 
              text-shadow: 0 2px 4px rgba(0,0,0,0.3);
              letter-spacing: 2px;
            }
            .header h1 {
              font-size: 28px;
              margin: 15px 0;
              font-weight: 600;
              text-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }
            .header p {
              font-size: 14px;
              opacity: 0.9;
              margin: 10px 0 0 0;
            }
            .content {
              padding: 40px 30px;
            }
            .section { 
              margin-bottom: 40px; 
              page-break-inside: avoid; 
              background: #fafbfc;
              border-radius: 12px;
              padding: 25px;
              border: 1px solid #e1e5e9;
              box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            }
            .section-title { 
              font-size: 20px; 
              font-weight: 700; 
              color: #2c3e50; 
              margin-bottom: 20px; 
              padding-bottom: 12px;
              border-bottom: 3px solid #667eea;
              position: relative;
            }
            .section-title::after {
              content: '';
              position: absolute;
              bottom: -3px;
              left: 0;
              width: 50px;
              height: 3px;
              background: #764ba2;
            }
            .info-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
              gap: 20px;
              margin: 20px 0;
            }
            .info-item {
              display: flex;
              align-items: center;
              padding: 15px;
              background: white;
              border-radius: 8px;
              border-left: 4px solid #667eea;
              box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            }
            .info-label {
              font-weight: 600;
              color: #2c3e50;
              margin-right: 10px;
              min-width: 80px;
            }
            .info-value {
              color: #34495e;
              flex: 1;
            }
            .score-grid { 
              display: grid; 
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
              gap: 20px; 
              margin: 25px 0; 
            }
            .score-item { 
              padding: 20px; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              border-radius: 12px; 
              text-align: center; 
              color: white;
              box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
              transition: transform 0.2s ease;
            }
            .score-value { 
              font-size: 32px; 
              font-weight: 800; 
              color: white;
              margin-bottom: 8px;
              text-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }
            .score-label {
              font-size: 14px;
              font-weight: 500;
              opacity: 0.9;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .question-item { 
              margin-bottom: 25px; 
              background: white;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 3px 10px rgba(0,0,0,0.08);
              border: 1px solid #e1e5e9;
            }
            .question-header {
              background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 15px 20px;
              font-weight: 600;
              font-size: 16px;
            }
            .question-content {
              padding: 20px;
            }
            .question-text { 
              font-weight: 600; 
              margin-bottom: 15px;
              color: #2c3e50;
              font-size: 15px;
              line-height: 1.5;
            }
            .answer-text { 
              margin: 15px 0; 
              padding: 15px; 
              background: #f8f9fa; 
              border-radius: 8px;
              border-left: 4px solid #667eea;
              font-size: 14px;
              line-height: 1.6;
            }
            .feedback-text { 
              color: #6c757d; 
              font-style: italic;
              background: #e9ecef;
              padding: 12px;
              border-radius: 6px;
              margin-top: 10px;
              font-size: 13px;
            }
            .scores-breakdown {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
              gap: 10px;
              margin: 15px 0;
              padding: 15px;
              background: #f1f3f4;
              border-radius: 8px;
            }
            .score-breakdown-item {
              text-align: center;
              padding: 8px;
              background: white;
              border-radius: 6px;
              border: 1px solid #dee2e6;
            }
            .score-breakdown-value {
              font-weight: 700;
              color: #667eea;
              font-size: 18px;
            }
            .score-breakdown-label {
              font-size: 11px;
              color: #6c757d;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-top: 2px;
            }
            .strength-item {
              border-left: 4px solid #28a745;
              background: linear-gradient(90deg, #d4edda 0%, #c3e6cb 100%);
            }
            .improvement-item {
              border-left: 4px solid #ffc107;
              background: linear-gradient(90deg, #fff3cd 0%, #ffeaa7 100%);
            }
            .final-score-banner {
              background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
              color: white;
              padding: 25px;
              border-radius: 12px;
              text-align: center;
              margin: 20px 0;
              box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
            }
            .final-score-value {
              font-size: 48px;
              font-weight: 800;
              margin-bottom: 10px;
              text-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }
            .final-score-label {
              font-size: 16px;
              font-weight: 500;
              opacity: 0.9;
            }
            @media print {
              body { 
                margin: 0; 
                background: white !important;
              }
              .container {
                box-shadow: none;
                max-width: none;
              }
              .no-print { display: none; }
              .page-break { page-break-before: always; }
              .section { box-shadow: none; }
              .question-item { box-shadow: none; }
              .score-item { box-shadow: none; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            ${printContent}
          </div>
        </body>
      </html>
    `)

    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
    printWindow.close()
  }

  const generatePrintContent = (data: any, title: string, type: string) => {
    const currentDate = new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    let content = `
      <div class="header">
        <div class="header-content">
          <div class="logo">mirAI</div>
          <h1>${title}</h1>
          <p>Generado el ${currentDate}</p>
        </div>
      </div>
      <div class="content">
    `

    if (type === "interview" && data) {
      const finalScore = data.puntajeFinal || 0;
      const scoreColor = finalScore >= 80 ? '#28a745' : finalScore >= 60 ? '#ffc107' : '#dc3545';
      
      content += `
        <div class="section">
          <div class="section-title">Resumen de la Entrevista</div>
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Candidato:</div>
              <div class="info-value">${candidateName || "No especificado"}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Posición:</div>
              <div class="info-value">${jobTitle || data.tituloConvocatoria || "No especificada"}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Empresa:</div>
              <div class="info-value">${companyName || "No especificada"}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Fecha:</div>
              <div class="info-value">${data.fechaEvaluacion ? new Date(data.fechaEvaluacion).toLocaleDateString('es-ES') : currentDate}</div>
            </div>
          </div>
          
          <div class="final-score-banner" style="background: linear-gradient(135deg, ${scoreColor} 0%, ${scoreColor}dd 100%);">
            <div class="final-score-value">${finalScore.toFixed(1)}/100</div>
            <div class="final-score-label">Puntuación Final</div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Puntuaciones por Criterio</div>
          <div class="score-grid">
            ${
              data.resumenPorCriterio
                ? Object.entries(data.resumenPorCriterio)
                    .map(
                      ([key, value]: [string, any]) => {
                        const criterioLabels: {[key: string]: string} = {
                          'claridad_estructura': 'Claridad y Estructura',
                          'dominio_tecnico': 'Conocimiento Técnico',
                          'pertinencia': 'Relevancia',
                          'comunicacion_seguridad': 'Comunicación'
                        };
                        return `
                          <div class="score-item">
                            <div class="score-value">${typeof value === 'number' ? value.toFixed(1) : value}/10</div>
                            <div class="score-label">${criterioLabels[key] || key.replace(/_/g, " ")}</div>
                          </div>
                        `
                      }
                    )
                    .join("")
                : "<p>No hay puntuaciones disponibles</p>"
            }
          </div>
        </div>

        ${data.fortalezas && data.fortalezas.length > 0 ? `
        <div class="section">
          <div class="section-title">Fortalezas Identificadas</div>
          ${data.fortalezas.map((strength: string) => `
            <div class="question-item strength-item">
              <div class="question-content">
                <div class="answer-text">${strength}</div>
              </div>
            </div>
          `).join('')}
        </div>
        ` : ''}

        ${data.oportunidadesMejora && data.oportunidadesMejora.length > 0 ? `
        <div class="section">
          <div class="section-title">Áreas de Mejora</div>
          ${data.oportunidadesMejora.map((improvement: string) => `
            <div class="question-item improvement-item">
              <div class="question-content">
                <div class="answer-text">${improvement}</div>
              </div>
            </div>
          `).join('')}
        </div>
        ` : ''}

        ${data.evaluacionesPorPregunta && data.evaluacionesPorPregunta.length > 0 ? `
        <div class="section page-break">
          <div class="section-title">Análisis Detallado por Pregunta</div>
          ${
            data.evaluacionesPorPregunta
              .map(
                (item: any, index: number) => `
            <div class="question-item">
              <div class="question-header">Pregunta ${index + 1}</div>
              <div class="question-content">
                <div class="question-text">${item.pregunta?.texto || `Pregunta ${index + 1}`}</div>
                <div class="answer-text"><strong>Respuesta:</strong> ${item.respuesta || "No se proporcionó respuesta"}</div>
                ${item.evaluacion ? `
                  <div class="scores-breakdown">
                    <div class="score-breakdown-item">
                      <div class="score-breakdown-value">${item.evaluacion.claridadEstructura?.toFixed(1) || "N/A"}/10</div>
                      <div class="score-breakdown-label">Claridad</div>
                    </div>
                    <div class="score-breakdown-item">
                      <div class="score-breakdown-value">${item.evaluacion.dominioTecnico?.toFixed(1) || "N/A"}/10</div>
                      <div class="score-breakdown-label">Técnico</div>
                    </div>
                    <div class="score-breakdown-item">
                      <div class="score-breakdown-value">${item.evaluacion.pertinencia?.toFixed(1) || "N/A"}/10</div>
                      <div class="score-breakdown-label">Relevancia</div>
                    </div>
                    <div class="score-breakdown-item">
                      <div class="score-breakdown-value">${item.evaluacion.comunicacionSeguridad?.toFixed(1) || "N/A"}/10</div>
                      <div class="score-breakdown-label">Comunicación</div>
                    </div>
                  </div>
                  <div class="final-score-banner" style="margin: 15px 0; padding: 15px;">
                    <div class="final-score-value" style="font-size: 24px;">${item.evaluacion.puntuacionFinal?.toFixed(1) || "N/A"}/10</div>
                    <div class="final-score-label" style="font-size: 14px;">Puntuación de la Pregunta</div>
                  </div>
                  ${item.evaluacion.feedback ? `<div class="feedback-text"><strong>Retroalimentación de IA:</strong> ${item.evaluacion.feedback}</div>` : ''}
                ` : ''}
              </div>
            </div>
          `,
                  )
                  .join("")
          }
        </div>
        ` : ''}
      `
    } else if (type === "analytics" && data) {
      content += `
        <div class="section">
          <div class="section-title">Analíticas de la Plataforma</div>
          <div class="score-grid">
            <div class="score-item">
              <div class="score-value">${data.totalUsers || 0}</div>
              <div class="score-label">Usuarios Totales</div>
            </div>
            <div class="score-item">
              <div class="score-value">${data.totalCompanies || 0}</div>
              <div class="score-label">Empresas</div>
            </div>
            <div class="score-item">
              <div class="score-value">${data.totalInterviews || 0}</div>
              <div class="score-label">Entrevistas</div>
            </div>
            <div class="score-item">
              <div class="score-value">${data.completionRate || 0}%</div>
              <div class="score-label">Tasa de Finalización</div>
            </div>
          </div>
        </div>
      `
    }

    content += `
      </div>
    `

    return content
  }

  return (
    <Button type="primary" icon={<PrinterOutlined />} onClick={handlePrint} className="btn-gradient">
      Imprimir Reporte
    </Button>
  )
}

export default PrintReport
