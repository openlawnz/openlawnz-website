import HeroSmall from "@/components/hero/hero-small"
import Layout from "@/components/layout/layout"

import SideNav from "../../components/side-nav/side-nav"

const HowToUseContainer = () => (
    <Layout>
        <HeroSmall title="How to Use"/>
        <div className="inner">
            <div className="body-wrap content-page right-on-top">
                <div className="body-left">
                    <div id="laws-001" className="content-section">
                        <h2 className="body-title">Laws 001</h2>
                        <p>
                            Not quite Laws 101, this is a quick guide into the principles of how to do legal
                            research in New Zealand.
                        </p>
                        <h3 className="body-title">What is law?</h3>
                        <p>
                            Law in New Zealand is mostly made up of legislation (Acts of Parliament) and case law
                            (decisions of Judges in Courts).
                        </p>
                        <p>
                            Case law applies and interprets legislation, and it can be helpful for understanding how
                            legislation works. Sometimes the Courts can make their own law too.
                        </p>
                        <p>
                            You can view and browse all of New Zealand’s legislation at the Parliamentary Counsel
                            Office website, legislation.govt.nz.
                        </p>
                        <p>
                            You can use OpenLaw NZ to find case law that might help you find the answer to a legal
                            question. This is how.
                        </p>
                        <h3 className="body-title">New Zealand Court structure</h3>
                        <p>
                            First, understand the Courts structure. The Court system in New Zealand is structured in
                            a hierarchy. From top to bottom:
                        </p>
                        <ol>
                            <li>The Supreme Court</li>
                            <li>The Court of Appeal</li>
                            <li>High Court</li>
                            <li>District Court (including Family Court and Youth Court)</li>
                            <li>Tribunals (including the Disputes Tribunal and others)</li>
                        </ol>
                        <p>
                            Decisions of courts higher in rank are binding on those of lower rank. That is, given
                            the same legal issue, a decision of the Supreme Court must be followed by all lower
                            courts.
                        </p>
                        <p>
                            Therefore, if you have a legal question, decisions issued by higher courts will be the
                            most useful for telling you what the law is and how it should be applied. If you can
                            find a Supreme Court case on topic, that will be the most authoritative and useful,
                            because anything the Supreme Court says, all other Courts must follow.
                        </p>
                        <h3 className="body-title">
                            How to find an answer to a legal question
                        </h3>
                        <h4 className="body-title">Step 1 – identify the relevant law</h4>
                        <p>
                            The easiest place to start is with the section (or sections) of an Act of Parliament
                            that apply to your situation. For example, if you want to know about parenting orders,
                            you need to find law about section 48 of the Care of Children Act 2004.
                        </p>
                        <p>
                            If you have a legislation title and section, or even just a legislation title, go to the
                            next step.
                        </p>
                        <p>
                            If not, you can either see if you can find the relevant Act by reviewing relevant
                            government websites (they will normally tell you what legislation is relevant) or
                            searching on legislation.govt.nz. It might take you a few tries, but search through the
                            legislation until you have at least one section that you think is relevant to your
                            situation.
                        </p>
                        <h4 className="body-title">
                            Step 2 – Confirm the section is relevant and understand how it is applied
                        </h4>
                        <p>
                            Once you have a section of an Act, you can look at case law. Case law will help you
                            understand what that section means and how it is applied.
                        </p>
                        <p>
                            You can use OpenLaw NZ to find case law that talks about sections in two different ways:
                        </p>
                        <ul>
                            <li>
                                Use the Advanced Search. Choose “Legislation” from the drop down. Enter the title of
                                the Act, and the section number.
                            </li>
                            <li>
                                Use the Chrome Extension (if you’re using the Chrome web browser). Install the
                                extension, then navigate on legislation.govt.nz to the section you’re interested in.
                                Click the OpenLaw NZ button to view a list of cases that talk about it.
                            </li>
                        </ul>
                        <p>
                            Alternatively, you can use OpenLaw NZ fulltext search to find cases with relevant facts
                            or law. See below for some guidance on how you can use our search.
                        </p>
                        <h4 className="body-title">Step 3 – Find related cases</h4>
                        <p>
                            Once you have a case, it might be helpful to see if other cases talk about it. If lots
                            of cases talk about it, that is generally a sign that it is an important case. Likewise,
                            it is important to check that the case has not been overruled by a higher Court.
                        </p>
                        <p>
                            If the case you've found is not quite right for your situation, you could look at cases
                            cited by the case for further guidance on the relevant legal principles. If the case
                            refers to another case and indicates that the other case is more authoritative or
                            important, you should check that other case.
                        </p>
                        <p>
                            You can navigate to and see other cases cited by a case (cases referred to by the
                            present case), or other cases that cite a case (other cases that refer to the present
                            case), using the information on the right side of the page.
                        </p>
                    </div>
                    <div id="using-search" className="content-section">
                        <h2 className="body-title">Using the Search</h2>
                        <p>
                            OpenLaw NZ search allows the following search syntax (in the main fulltext search field
                            - not specific field searches like category or court).
                        </p>
                        <h3 className="body-title">Boolean search</h3>
                        <p>The following operators are enabled:</p>
                        <h4 className="body-title">Phrases ""</h4>
                        <p>
                            Search for specific phrases by putting them in quotes. For example,
                            <code>"rescue helicopter"</code> will search for that exact phrase.
                        </p>
                        <h4 className="body-title">OR operator "OR" or ||</h4>
                        <p>
                            The OR operator is a vertical bar or pipe character. For example:
                            <code>wifi || luxury</code> will search for documents containing either "wifi" or
                            "luxury" or both.
                        </p>
                        <p>
                            <strong>OR is the default conjunction operator</strong>, so you can also leave it out:
                            <code>wifi luxury</code> is the equivalent of <code>wifi || luxury</code>.
                        </p>
                        <h4 className="body-title">AND operator "AND", "&&" or "+"</h4>
                        <p>
                            The AND operator is an ampersand or a plus sign. For example:
                            <code>wifi && luxury</code> will search for documents containing both "wifi" and
                            "luxury". The plus character (+) is used for required terms. For example, +wifi +luxury
                            stipulates that both terms must appear somewhere in the field of a single document.
                        </p>
                        <h4 className="body-title">NOT operator "NOT", "!" or "-"</h4>
                        <p>
                            The NOT operator is a minus sign. For example,
                            <code>wifi –luxury</code> will search for documents that have the wifi term and do not
                            contain the term luxury.
                        </p>
                        <h3 className="body-title">Fuzzy search</h3>
                        <p>
                            A fuzzy search finds matches in terms that have a similar construction, expanding a term
                            up to the maximum of 50 terms that meet the distance criteria of two or less. For more
                            information, see Fuzzy search.
                        </p>
                        <p>
                            To do a fuzzy search, use the tilde "~" symbol at the end of a single word with an
                            optional parameter, a number between 0 and 2 (default), that specifies the edit
                            distance. For example,
                            <code>"blue~"</code> or <code>"blue~1"</code> would return "blue", "blues", and "glue".
                        </p>
                        <p>
                            Fuzzy search can only be applied to terms, not phrases, but you can append the tilde to
                            each term individually in a multi-part name or phrase.
                        </p>
                        <h3 className="body-title">Proximity search</h3>
                        <p>
                            Proximity searches are used to find terms that are near each other in a document. Insert
                            a tilde "~" symbol at the end of a phrase followed by the number of words that create
                            the proximity boundary. For example, <code>"hotel airport"~5</code> will find the terms
                            "hotel" and "airport" within 5 words of each other in a document.
                        </p>
                        <h3 className="body-title">Wildcards</h3>
                        <p>
                            You can use <code>*</code> for multiple and <code>?</code> for single character wildcard
                            searches. For example, a query expression of search=alpha* returns "alphanumeric" or
                            "alphabetical".
                        </p>
                    </div>
                    <div id="using-api" className="content-section">
                        <h2 className="body-title">Using the API</h2>
                        <h3 className="body-title">Terms of use</h3>
                        <p>
                            By using our API you agree to the
                            <a href="https://s3-ap-southeast-2.amazonaws.com/assets.openlaw.nz/apiterms.pdf"
                                >API Terms of Use</a
                            >
                        </p>
                        <h3 className="body-title">What the API does</h3>
                        <p>
                            The OpenLaw NZ API facilitates programmatic access to our case law data. This means you
                            can integrate case law data and insights into your own applications or services.
                        </p>
                        <p>
                            If you would like to use our API please get in touch with us and we'll provide you with
                            an API key
                        </p>
                    </div>
                </div>

                <SideNav heading="On this page" items={[
                    {
                        text: "Laws 001", 
                        address: "#laws-001"
                    },
                    {
                        text: "Using Search",
                        address: "#using-search"
                    },
                    {
                        text: "Using API",
                        address: "#using-api"
                    }
                ]}/>    
            </div>
        </div>
    </Layout>
)

export default HowToUseContainer

