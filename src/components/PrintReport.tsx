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
  title = "Report", 
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
              font-family: 'Inter', Arial, sans-serif; 
              margin: 0; 
              padding: 20px; 
              color: #333;
              line-height: 1.6;
            }
            .header { 
              text-align: center; 
              border-bottom: 2px solid #6366f1; 
              padding-bottom: 20px; 
              margin-bottom: 30px; 
            }
            .logo { 
              font-size: 24px; 
              font-weight: bold; 
              color: #6366f1; 
              margin-bottom: 10px; 
            }
            .section { 
              margin-bottom: 30px; 
              page-break-inside: avoid; 
            }
            .section-title { 
              font-size: 18px; 
              font-weight: bold; 
              color: #1f2937; 
              border-bottom: 1px solid #e5e7eb; 
              padding-bottom: 10px; 
              margin-bottom: 15px; 
            }
            .score-grid { 
              display: grid; 
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
              gap: 15px; 
              margin: 20px 0; 
            }
            .score-item { 
              padding: 15px; 
              border: 1px solid #e5e7eb; 
              border-radius: 8px; 
              text-align: center; 
            }
            .score-value { 
              font-size: 24px; 
              font-weight: bold; 
              color: #6366f1; 
            }
            .question-item { 
              margin-bottom: 20px; 
              padding: 15px; 
              border-left: 4px solid #6366f1; 
              background-color: #f9fafb; 
            }
            .question-text { 
              font-weight: bold; 
              margin-bottom: 10px; 
            }
            .answer-text { 
              margin: 10px 0; 
              padding: 10px; 
              background-color: white; 
              border-radius: 4px; 
            }
            .feedback-text { 
              color: #6b7280; 
              font-style: italic; 
            }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
              .page-break { page-break-before: always; }
            }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `)

    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
    printWindow.close()
  }

  const generatePrintContent = (data: any, title: string, type: string) => {
    const currentDate = new Date().toLocaleDateString()

    let content = `
      <div class="header">
        <div class="logo">mirAI</div>
        <h1>${title}</h1>
        <p>Generated on ${currentDate}</p>
      </div>
    `

    if (type === "interview" && data) {
      content += `
        <div class="section">
          <div class="section-title">Interview Summary</div>
          <p><strong>Candidate:</strong> ${candidateName || "N/A"}</p>
          <p><strong>Position:</strong> ${jobTitle || data.tituloConvocatoria || "N/A"}</p>
          <p><strong>Company:</strong> ${companyName || "N/A"}</p>
          <p><strong>Date:</strong> ${data.fechaEvaluacion ? new Date(data.fechaEvaluacion).toLocaleDateString() : currentDate}</p>
          <p><strong>Final Score:</strong> ${data.puntajeFinal ? data.puntajeFinal.toFixed(1) : "N/A"}/100</p>
        </div>

        <div class="section">
          <div class="section-title">Overall Scores</div>
          <div class="score-grid">
            ${
              data.resumenPorCriterio
                ? Object.entries(data.resumenPorCriterio)
                    .map(
                      ([key, value]: [string, any]) => `
              <div class="score-item">
                <div class="score-value">${typeof value === 'number' ? value.toFixed(1) : value}/10</div>
                <div>${key.replace(/_/g, " ").toUpperCase()}</div>
              </div>
            `,
                    )
                    .join("")
                : "<p>No scores available</p>"
            }
          </div>
        </div>

        ${data.fortalezas && data.fortalezas.length > 0 ? `
        <div class="section">
          <div class="section-title">Strengths</div>
          ${data.fortalezas.map((strength: string) => `
            <div class="question-item" style="border-left-color: #52c41a; background-color: #f6ffed;">
              <div class="answer-text">${strength}</div>
            </div>
          `).join('')}
        </div>
        ` : ''}

        ${data.oportunidadesMejora && data.oportunidadesMejora.length > 0 ? `
        <div class="section">
          <div class="section-title">Areas for Improvement</div>
          ${data.oportunidadesMejora.map((improvement: string) => `
            <div class="question-item" style="border-left-color: #fa8c16; background-color: #fff2e8;">
              <div class="answer-text">${improvement}</div>
            </div>
          `).join('')}
        </div>
        ` : ''}

        ${data.evaluacionesPorPregunta && data.evaluacionesPorPregunta.length > 0 ? `
        <div class="section page-break">
          <div class="section-title">Question-by-Question Analysis</div>
          ${
            data.evaluacionesPorPregunta
              .map(
                (item: any, index: number) => `
            <div class="question-item">
              <div class="question-text">Question ${index + 1}: ${item.pregunta?.texto || `Question ${index + 1}`}</div>
              <div class="answer-text"><strong>Answer:</strong> ${item.respuesta || "No answer provided"}</div>
              ${item.evaluacion ? `
                <div class="feedback-text"><strong>Final Score:</strong> ${item.evaluacion.puntuacionFinal?.toFixed(1) || "N/A"}/10</div>
                <div style="margin-top: 10px;">
                  <strong>Detailed Scores:</strong><br>
                  • Clarity & Structure: ${item.evaluacion.claridadEstructura?.toFixed(1) || "N/A"}/10<br>
                  • Technical Knowledge: ${item.evaluacion.dominioTecnico?.toFixed(1) || "N/A"}/10<br>
                  • Relevance: ${item.evaluacion.pertinencia?.toFixed(1) || "N/A"}/10<br>
                  • Communication: ${item.evaluacion.comunicacionSeguridad?.toFixed(1) || "N/A"}/10
                </div>
                ${item.evaluacion.feedback ? `<div class="feedback-text" style="margin-top: 10px;"><strong>AI Feedback:</strong> ${item.evaluacion.feedback}</div>` : ''}
              ` : ''}
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
          <div class="section-title">Platform Analytics</div>
          <div class="score-grid">
            <div class="score-item">
              <div class="score-value">${data.totalUsers || 0}</div>
              <div>Total Users</div>
            </div>
            <div class="score-item">
              <div class="score-value">${data.totalCompanies || 0}</div>
              <div>Companies</div>
            </div>
            <div class="score-item">
              <div class="score-value">${data.totalInterviews || 0}</div>
              <div>Interviews</div>
            </div>
            <div class="score-item">
              <div class="score-value">${data.completionRate || 0}%</div>
              <div>Completion Rate</div>
            </div>
          </div>
        </div>
      `
    }

    return content
  }

  return (
    <Button type="primary" icon={<PrinterOutlined />} onClick={handlePrint} className="btn-gradient">
      Print Report
    </Button>
  )
}

export default PrintReport
