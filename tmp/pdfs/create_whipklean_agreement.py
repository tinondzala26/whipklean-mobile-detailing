from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    Flowable,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "output" / "pdf" / "whipklean-mobile-service-agreement.pdf"
PUBLIC = ROOT / "public" / "docs" / "whipklean-mobile-service-agreement.pdf"

BLUE = colors.HexColor("#68C9F1")
PALE = colors.HexColor("#EAF8FE")
INK = colors.HexColor("#101820")
MUTED = colors.HexColor("#52636C")
LINE = colors.HexColor("#C9DCE4")
WHITE = colors.white

PAGE_W, PAGE_H = letter
MARGIN_X = 0.62 * inch
TOP = 0.66 * inch
BOTTOM = 0.62 * inch


class AgreementDocTemplate(BaseDocTemplate):
    pass


class TextField(Flowable):
    def __init__(self, name, tooltip, width, height, multiline=False):
        super().__init__()
        self.name = name
        self.tooltip = tooltip
        self.width = width
        self.height = height
        self.multiline = multiline

    def draw(self):
        self.canv.acroForm.textfield(
            name=self.name,
            tooltip=self.tooltip,
            x=0,
            y=0,
            width=self.width,
            height=self.height,
            borderWidth=0.8,
            borderColor=LINE,
            fillColor=colors.white,
            textColor=INK,
            forceBorder=True,
            fontName="Helvetica",
            fontSize=9,
            fieldFlags="multiline" if self.multiline else "",
            relative=True,
        )


styles = getSampleStyleSheet()
styles.add(
    ParagraphStyle(
        name="AgreementTitle",
        parent=styles["Title"],
        fontName="Helvetica-Bold",
        fontSize=19,
        leading=22,
        textColor=INK,
        alignment=TA_LEFT,
        spaceAfter=5,
    )
)
styles.add(
    ParagraphStyle(
        name="AgreementSub",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8.4,
        leading=11,
        textColor=MUTED,
        spaceAfter=10,
    )
)
styles.add(
    ParagraphStyle(
        name="SectionHead",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=10.5,
        leading=13,
        textColor=INK,
        spaceBefore=7,
        spaceAfter=5,
        keepWithNext=True,
    )
)
styles.add(
    ParagraphStyle(
        name="Clause",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8.15,
        leading=11,
        textColor=INK,
        spaceAfter=5,
    )
)
styles.add(
    ParagraphStyle(
        name="Small",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=7.2,
        leading=9.2,
        textColor=MUTED,
    )
)
styles.add(
    ParagraphStyle(
        name="Notice",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=7.5,
        leading=9.5,
        alignment=TA_CENTER,
        textColor=INK,
    )
)


def footer(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(INK)
    canvas.rect(0, PAGE_H - 0.34 * inch, PAGE_W, 0.34 * inch, fill=1, stroke=0)
    canvas.setFillColor(BLUE)
    canvas.setFont("Helvetica-Bold", 9)
    canvas.drawString(MARGIN_X, PAGE_H - 0.22 * inch, "WHIPKLEAN")
    canvas.setFillColor(WHITE)
    canvas.setFont("Helvetica", 6.8)
    canvas.drawRightString(
        PAGE_W - MARGIN_X,
        PAGE_H - 0.22 * inch,
        "MOBILE SERVICE AUTHORIZATION & VEHICLE MOVEMENT AGREEMENT",
    )
    canvas.setStrokeColor(LINE)
    canvas.line(MARGIN_X, 0.43 * inch, PAGE_W - MARGIN_X, 0.43 * inch)
    canvas.setFillColor(MUTED)
    canvas.setFont("Helvetica", 6.5)
    canvas.drawString(MARGIN_X, 0.25 * inch, "whipklean@yahoo.com  |  (416) 555-0147")
    canvas.drawRightString(
        PAGE_W - MARGIN_X, 0.25 * inch, f"Page {doc.page} of 4  |  Effective 28 July 2026"
    )
    canvas.restoreState()


def text_field(name, tooltip, width, height=0.27 * inch, multiline=False):
    return TextField(name, tooltip, width, height, multiline)


def labelled_field(label, name, width):
    return [
        Paragraph(label, styles["Small"]),
        text_field(name, label, width),
    ]


def clause(number, title, text):
    return Paragraph(
        f"<b>{number}. {title}.</b> {text}",
        styles["Clause"],
    )


def build():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    PUBLIC.parent.mkdir(parents=True, exist_ok=True)

    doc = AgreementDocTemplate(
        str(OUT),
        pagesize=letter,
        leftMargin=MARGIN_X,
        rightMargin=MARGIN_X,
        topMargin=TOP,
        bottomMargin=BOTTOM,
        title="WhipKlean Mobile Service Authorization & Vehicle Movement Agreement",
        author="WhipKlean",
    )
    frame = Frame(
        MARGIN_X,
        BOTTOM,
        PAGE_W - 2 * MARGIN_X,
        PAGE_H - TOP - BOTTOM,
        id="normal",
        leftPadding=0,
        rightPadding=0,
        topPadding=0,
        bottomPadding=0,
    )
    doc.addPageTemplates([PageTemplate(id="agreement", frames=[frame], onPage=footer)])

    story = []
    story.append(Spacer(1, 0.08 * inch))
    story.append(Paragraph("Mobile Service Authorization &<br/>Vehicle Movement Agreement", styles["AgreementTitle"]))
    story.append(
        Paragraph(
            "This agreement records the customer's authorization for mobile detailing at an approved service location and limited movement "
            "of the vehicle at that location. Complete all fields, review every term, and sign before work begins.",
            styles["AgreementSub"],
        )
    )
    notice = Table(
        [[Paragraph("CUSTOMER SERVICE AGREEMENT — REVIEW ALL TERMS BEFORE SIGNING", styles["Notice"])]],
        colWidths=[PAGE_W - 2 * MARGIN_X],
    )
    notice.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), PALE),
                ("BOX", (0, 0), (-1, -1), 1, BLUE),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 7),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
            ]
        )
    )
    story += [notice, Spacer(1, 0.11 * inch)]

    story.append(Paragraph("A. Customer & Vehicle Information", styles["SectionHead"]))
    field_rows = [
        labelled_field("Customer legal name", "customer_name", 2.55 * inch)
        + labelled_field("Phone / email", "customer_contact", 2.55 * inch),
        labelled_field("Customer address", "customer_address", 2.55 * inch)
        + labelled_field("Service date / arrival window", "service_date", 2.55 * inch),
        labelled_field("Vehicle year / make / model", "vehicle_details", 2.55 * inch)
        + labelled_field("Licence plate / province", "plate_province", 2.55 * inch),
        labelled_field("VIN (last 6 minimum)", "vin", 2.55 * inch)
        + labelled_field("Odometer", "odometer", 2.55 * inch),
    ]
    info = Table(field_rows, colWidths=[1.05 * inch, 2.55 * inch, 1.05 * inch, 2.55 * inch])
    info.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "BOTTOM"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 7),
                ("TOPPADDING", (0, 0), (-1, -1), 3),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ]
        )
    )
    story.append(info)
    location_table = Table(
        [
            [
                Paragraph("Approved mobile service address", styles["Small"]),
                text_field("service_location", "Approved mobile service address", 5.65 * inch),
            ],
            [
                Paragraph("Property contact / access instructions", styles["Small"]),
                text_field("site_access", "Property contact and access instructions", 5.65 * inch),
            ],
        ],
        colWidths=[1.35 * inch, 5.65 * inch],
    )
    location_table.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 7),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ]
        )
    )
    story.append(location_table)

    story.append(Paragraph("B. Requested Services & Known Conditions", styles["SectionHead"]))
    services = Table(
        [
            ["Service requested", text_field("service_requested", "Service requested", 5.65 * inch)],
            ["Quoted / approved price", text_field("approved_price", "Quoted or approved price", 2.3 * inch)],
            [
                Paragraph(
                    "Pre-existing damage, loose trim, warning lights, leaks, valuables, aftermarket equipment or other concerns",
                    styles["Small"],
                ),
                text_field("known_conditions", "Known conditions", 5.65 * inch, 0.55 * inch, True),
            ],
        ],
        colWidths=[1.35 * inch, 5.65 * inch],
    )
    services.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("FONTNAME", (0, 0), (0, -1), "Helvetica"),
                ("FONTSIZE", (0, 0), (0, -1), 7.2),
                ("TEXTCOLOR", (0, 0), (0, -1), MUTED),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 7),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ]
        )
    )
    story.append(services)

    story.append(PageBreak())
    story.append(Paragraph("C. Core Terms", styles["SectionHead"]))
    story += [
        clause(
            1,
            "Authority to Engage WhipKlean",
            "The customer confirms they are the registered owner of the vehicle or have the owner's authority to request and approve the services described above.",
        ),
        clause(
            2,
            "Service Authorization",
            "The customer authorizes WhipKlean to travel to the approved service location and perform the approved cleaning, detailing and protective treatments. WhipKlean may photograph the vehicle and immediate work area before and after service solely to document condition and work performed. Marketing use requires separate consent.",
        ),
        clause(
            3,
            "Limited Vehicle Movement",
            "The customer authorizes trained WhipKlean personnel holding an appropriate valid driver's licence to start, operate and move the vehicle only as reasonably necessary within the customer-approved driveway, parking area, fleet lot or immediately connected private property at the service location. Movement is limited to positioning the vehicle for safe service. It does not permit use on public roads, travel to another property or unrelated personal use unless the customer separately agrees in writing.",
        ),
        clause(
            4,
            "Registration, Licence Plates and Insurance Warranty",
            "The customer represents that, throughout the mobile appointment, the vehicle is lawfully registered, has valid licence plates or permits where required, and carries current automobile insurance sufficient for the vehicle and its authorized movement by service personnel at the approved property. The customer must disclose any policy restriction that may prevent or limit such movement and provide proof of insurance or registration on request.",
        ),
        clause(
            5,
            "Service-Location Permission and Access",
            "The customer confirms they own, occupy or have permission to use the approved service location for mobile vehicle detailing and to permit reasonable access by WhipKlean personnel and equipment. The customer must disclose site rules, drainage restrictions, hazards, parking controls and property-manager requirements before arrival. WhipKlean may refuse or pause service where the location is unsafe, unlawful, inaccessible or unsuitable.",
        ),
        clause(
            6,
            "Keys, Security and Personal Property",
            "The customer authorizes WhipKlean to possess the keys during service and will remain reasonably reachable. The customer must remove cash, valuables, medications, firearms and sensitive documents. WhipKlean is not responsible for undisclosed items or ordinary personal property left in the vehicle except to the extent loss is caused by WhipKlean's negligence.",
        ),
    ]
    story.append(PageBreak())

    story.append(Paragraph("Terms Continued", styles["AgreementTitle"]))
    story += [
        clause(
            7,
            "Vehicle Condition and Pre-Existing Defects",
            "The customer must disclose known mechanical, electrical, body, glass, trim, upholstery or paint defects. WhipKlean is not responsible for pre-existing damage, latent defects, wear, corrosion, weak clear coat, loose trim, non-factory modifications, failing adhesives or deterioration revealed by normal cleaning, except to the extent WhipKlean negligently causes additional damage.",
        ),
        clause(
            8,
            "Products, Chemicals and Results",
            "The customer authorizes use of professional cleaning and corrosion-protective products appropriate to the selected service. Results vary with age, material and condition. WhipKlean does not guarantee complete removal of stains, odours, scratches, oxidation, rust or contamination. The customer must disclose known sensitivities, coatings, repairs or product restrictions.",
        ),
        clause(
            9,
            "Mobile Utilities, Equipment and Work Area",
            "Before booking, the customer must accurately state whether safe water and electrical access are available. WhipKlean may use its own mobile equipment or approved customer utilities as quoted. The customer will keep people, pets and unnecessary vehicles clear of the work area. WhipKlean will use reasonable care to protect the immediate property but is not responsible for pre-existing pavement, drainage, landscaping or electrical defects.",
        ),
        clause(
            10,
            "Additional Work and Charges",
            "The quoted price covers the approved mobile service and disclosed travel area. Material additional work or charges require customer approval before proceeding. If inaccurate information, denied property access, an undisclosed hazard or a false insurance or registration statement causes WhipKlean to incur reasonable extra travel, callout, clean-up, disposal, towing, claim-deductible or third-party costs, the customer agrees to reimburse documented costs to the extent permitted by law, excluding any cost caused by WhipKlean's negligence or wilful misconduct.",
        ),
        clause(
            11,
            "Payment and Collection",
            "Payment is due when the mobile service is completed unless otherwise agreed in writing. The customer is responsible for approved service charges, disclosed travel or callout charges, applicable taxes and lawful collection costs. WhipKlean will provide an itemized invoice on request.",
        ),
        clause(
            12,
            "Cancellation, Access and Weather",
            "The customer should provide at least 24 hours' notice of cancellation. Any cancellation, callout or failed-access fee must be disclosed before booking or separately approved. WhipKlean may reschedule, relocate by agreement or stop work when weather, temperature, lighting, drainage, utilities, site access or another condition prevents safe, lawful or quality service. WhipKlean will not charge for unperformed work, but a disclosed callout charge may apply when the customer supplied inaccurate site information or denied confirmed access.",
        ),
        clause(
            13,
            "Responsibility for Damage",
            "WhipKlean remains responsible for direct physical damage to the vehicle to the extent caused by its negligence or wilful misconduct, subject to applicable law. Neither party is liable for indirect, incidental or consequential loss that was not reasonably foreseeable. Nothing in this agreement excludes liability or consumer rights that cannot legally be excluded.",
        ),
        clause(
            14,
            "Customer Breach and Indemnity",
            "To the extent permitted by law, the customer will indemnify WhipKlean for third-party claims and reasonable documented expenses arising directly from the customer's lack of authority to use the property, inaccurate insurance or registration representation, undisclosed site or vehicle hazard or material breach of this agreement. This does not apply to loss caused by WhipKlean's negligence or wilful misconduct.",
        ),
        clause(
            15,
            "Incident and Insurance Cooperation",
            "If an incident occurs, both parties will promptly share relevant information, preserve photographs and records, notify insurers when appropriate and reasonably cooperate with any investigation or claim. No party admits liability merely by reporting an incident.",
        ),
        clause(
            16,
            "Entire Agreement and Governing Law",
            "This document, the approved quote, confirmed service address and any written addendum form the entire mobile service agreement. Changes must be written and accepted by both parties. The law of the Canadian province or territory where the mobile service is delivered governs. If a term is unenforceable, the remaining terms continue to the extent permitted by law.",
        ),
    ]

    story.append(Spacer(1, 0.08 * inch))
    ack = Table(
        [
            [
                Paragraph(
                    "<b>CUSTOMER ACKNOWLEDGEMENT</b><br/>I have read this agreement, had an opportunity to ask questions, "
                    "confirm the vehicle information is accurate, and voluntarily authorize the services and limited vehicle movement described above.",
                    styles["Clause"],
                )
            ]
        ],
        colWidths=[PAGE_W - 2 * MARGIN_X],
    )
    ack.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), PALE),
                ("BOX", (0, 0), (-1, -1), 1, BLUE),
                ("LEFTPADDING", (0, 0), (-1, -1), 10),
                ("RIGHTPADDING", (0, 0), (-1, -1), 10),
                ("TOPPADDING", (0, 0), (-1, -1), 9),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
            ]
        )
    )
    story.append(ack)
    story.append(PageBreak())

    story.append(Paragraph("Declarations & Signatures", styles["AgreementTitle"]))
    story.append(
        Paragraph(
            "Initial each declaration and complete both signature blocks. A typed name is provided for convenience; "
            "WhipKlean should confirm its electronic-signature process with local counsel before relying on it.",
            styles["AgreementSub"],
        )
    )

    declarations = [
        ("initial_authority", "I am the registered owner or am authorized by the registered owner."),
        ("initial_insurance", "The vehicle is currently insured, registered and licensed as represented."),
        ("initial_movement", "I authorize limited repositioning of the vehicle at the approved service location."),
        ("initial_site", "I have authority to use the service location and disclosed site-access requirements and hazards."),
        ("initial_condition", "I disclosed known vehicle defects, hazards, valuables and special product restrictions."),
        ("initial_terms", "I reviewed and accept the payment, liability and reimbursement terms."),
    ]
    decl_rows = []
    for field, text in declarations:
        decl_rows.append(
            [
                text_field(field, "Customer initials", 0.6 * inch),
                Paragraph(text, styles["Clause"]),
            ]
        )
    decl_table = Table(decl_rows, colWidths=[0.75 * inch, 6.25 * inch])
    decl_table.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
                ("LINEBELOW", (0, 0), (-1, -2), 0.5, LINE),
            ]
        )
    )
    story.append(decl_table)
    story.append(Spacer(1, 0.18 * inch))

    signature_rows = [
        labelled_field("Customer signature / typed legal name", "customer_signature", 2.35 * inch)
        + labelled_field("Date & time", "customer_signature_date", 2.25 * inch),
        labelled_field("WhipKlean representative", "whipklean_signature", 2.35 * inch)
        + labelled_field("Date & time", "whipklean_signature_date", 2.25 * inch),
    ]
    signature_table = Table(signature_rows, colWidths=[1.6 * inch, 2.35 * inch, 1.0 * inch, 2.25 * inch])
    signature_table.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "BOTTOM"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 7),
                ("TOPPADDING", (0, 0), (-1, -1), 7),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    story.append(signature_table)

    story.append(Paragraph("Optional Marketing Consent (not required for service)", styles["SectionHead"]))
    story.append(
        Table(
            [
                [
                    text_field("marketing_initials", "Initial only if consenting", 0.6 * inch),
                    Paragraph(
                        "I separately permit WhipKlean to use before-and-after images of the vehicle for marketing, provided licence plates, personal information and identifiable contents are obscured.",
                        styles["Clause"],
                    ),
                ]
            ],
            colWidths=[0.75 * inch, 6.25 * inch],
            style=TableStyle(
                [
                    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                    ("LEFTPADDING", (0, 0), (-1, -1), 0),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ]
            ),
        )
    )

    story.append(Spacer(1, 0.2 * inch))
    legal_note = Table(
        [
            [
                Paragraph(
                    "<b>JURISDICTION NOTICE:</b> Vehicle, insurance, consumer-protection, privacy and electronic-signature requirements "
                    "vary across Canada. This agreement is governed by the applicable laws at the confirmed service location, and mandatory "
                    "consumer rights remain unaffected.",
                    styles["Small"],
                )
            ]
        ],
        colWidths=[PAGE_W - 2 * MARGIN_X],
    )
    legal_note.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#F5F7F8")),
                ("BOX", (0, 0), (-1, -1), 0.8, LINE),
                ("LEFTPADDING", (0, 0), (-1, -1), 10),
                ("RIGHTPADDING", (0, 0), (-1, -1), 10),
                ("TOPPADDING", (0, 0), (-1, -1), 9),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
            ]
        )
    )
    story.append(legal_note)

    doc.build(story)
    PUBLIC.write_bytes(OUT.read_bytes())
    print(OUT)
    print(PUBLIC)


if __name__ == "__main__":
    build()
