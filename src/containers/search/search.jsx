import "./search.css"

import { Link, navigate } from "gatsby"
import { useEffect, useState } from "react"
import ReactPaginate from "react-paginate"
import sanitizeHtml from "sanitize-html"
import { NumberParam, StringParam, useQueryParams } from "use-query-params"

import HeroSmall from "@/components/hero/hero-small"
import Layout from "@/components/layout/layout"
import SEO from "@/components/seo"

const SearchPageContainer = () => {
    
    const [query, setQuery] = useQueryParams({
        q: StringParam,
        p: NumberParam,
        location: StringParam,
        court: StringParam
      });
    
    const [ newQuery, setNewQuery ] = useState(query)
    const [ newLocation, setNewLocation ] = useState(location)
    const [ newCourt, setNewCourt ] = useState(court)

    const [ cases, setCases ] = useState({})

    useEffect(() => {
       (async () => {
           const res = await fetch(`/search-cases?q=${query || '""'}&p=${page * 10 || 0}&court='${court || ''}'&location='${location || ''}'`)

           const cases = await res.json()
           setCases(cases)
       })()
    }, [query, page, court, location])

    const handleAdvancedSearch = (event) => {
        event.preventDefault()

        navigate(`/search?q=${newQuery || ''}&p=${0}&court=${newCourt || ''}&location=${newLocation || ''}`)
    }
    
    return (
        <Layout>
             <SEO 
                title={`Search - ${query}`} 
                description="OpenLaw NZ is an open-source legal data platform. Our goal is to improve the accessibility of case law 
                and other legal information in New Zealand. We want to make it easier for all New Zealanders to understand law. "
            />
            <HeroSmall title={query}/>

            <div className="inner">
				<div className="body-wrap right-on-top">
					<div className="body-left">
						<div id="search-body">							
							<table id="search-results-table">
								<thead>
									<tr>
										<th className="case-name-column">Case name</th>
										<th className="citation-column">Citation</th>
										<th className="date-column">Date</th>
										<th className="snippet-column">Snippet</th>
									</tr>
								</thead>
								<tbody id="search-results-table-body">
                                   {
                                       (cases.count) ?
                                       <>   
                                        {
                                            cases.results.map(({caseName, caseCitation, caseDate, highlights}, idx) => {
                                                const highlightText = highlights.caseText[0]
                                                return (
                                                    <tr key={idx}>
                                                        <td className="case-name-column"><Link to={`/case/${caseCitation.id}`}>{caseName}</Link></td>
                                                        <td className="citation-column">{caseCitation.citation}</td>
                                                        <td className="date-column">{caseDate.substring(0,10)}</td>
                                                        <td 
                                                            className="snippet-column" 
                                                            dangerouslySetInnerHTML={{
                                                                __html : sanitizeHtml(highlightText.length > 300 ? highlightText.substring(0,300) + '...' : highlightText)
                                                            }}
                                                        />
                                                    </tr>
                                                )
                                            })
                                        }   
                                       </>
                                       :
                                       <tr className="no-results-found"> 
                                            <td>No results found</td>
                                            <td>---</td>
                                            <td>---</td>
                                            <td>---</td>
                                        </tr>
                                   }
								</tbody>
							</table>
							<nav id="pagination">
                                <ReactPaginate
                                    previousLabel={'Previous'}
                                    nextLabel={'Next'}
                                    breakLabel={'...'}
                                    breakClassName={'break-me'}
                                    pageCount={Math.ceil(cases.count / 10)}
                                    marginPagesDisplayed={2}
                                    pageRangeDisplayed={5}
                                    forcePage={page}
                                    onPageChange={(e) => {setPage(e.selected)}}
                                    containerClassName={'pagination'}
                                    subContainerClassName={'pages pagination'}
                                    activeClassName={'active'}
                                />
							</nav>
						</div>						
					</div>
					<div className="body-right">
						<div id="advanced-search" className="on-this-page">
							<h2>Advanced</h2>
							<form onSubmit={handleAdvancedSearch}id="advanced-search">
								<div>
									<label htmlFor="q">Search Term</label>
									<input type="text" name="q" value={newQuery} onChange={e => setNewQuery(e.target.value)} id="q-advanced" />
								</div>
								<div>
									<label htmlFor="court">Court</label>
									<select name="court" value={newCourt} onChange={e => setNewCourt(e.target.value)} id="court">
										<option></option>
										<option>Court of Appeal</option>
										<option>District Court</option>
										<option>High Court</option>
										<option>Supreme Court</option>
									</select>
								</div>
								<div>
									<label htmlFor="location" >Location</label>
									<input type="text" name="location" id="location" value={newLocation} onChange={e => setNewLocation(e.target.value)}/>
								</div>
                                <div hidden={true}>
									<input hidden={true} type="number" name="page" id="page" value={page || 0} onChange={e => e.preventDefault()}/>
								</div>
								<button className="advanced-search-button">Search</button>
							</form>
														
							<h2 id="search-tips-header">Search tips</h2>
							<ul id="search-tips">
								<li>
									Search for phrases using quotes <code>""</code>.
								</li>
								<li>
									Combine terms or phases with AND, OR, and NOT.
								</li>
								<li>
										Default connector is OR: <code>auckland helicopter</code> searches for <code>auckland OR helicopter</code>.
								</li>								
								<li>
									Make a search term fuzzy by adding <code>~</code> at the end: <code>"rescu~"</code>. 
								</li>			
								<li>
									Proximity search by adding <code>~</code> and a number after a phrase.
								</li>								
								<li>
									<code>"pre report"~2</code> will find "pre-sentence report".
								</li>	
								<li>
									<a href="/how-to-use#using-search">See more tips</a>
								</li>
							</ul>
						</div>						
					</div>
				</div>
			</div>
        </Layout>
    )
}

export default SearchPageContainer