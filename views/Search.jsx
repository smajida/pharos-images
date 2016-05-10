"use strict";

const React = require("react");

const Page = require("./Page.jsx");

const NameFilter = require("./types/filter/Name.jsx");
const FixedStringFilter = require("./types/filter/FixedString.jsx");
const LocationFilter = require("./types/filter/Location.jsx");

const buckets = React.PropTypes.arrayOf(
    React.PropTypes.shape({
        count: React.PropTypes.number.isRequired,
        text: React.PropTypes.string.isRequired,
        url: React.PropTypes.string.isRequired,
    })
);

const Search = React.createClass({
    propTypes: {
        URL: React.PropTypes.func.isRequired,
        artworks: React.PropTypes.arrayOf(
            React.PropTypes.any
        ),
        breadcrumbs: React.PropTypes.arrayOf(
            React.PropTypes.shape({
                name: React.PropTypes.string.isRequired,
                url: React.PropTypes.string.isRequired,
            })
        ),
        end: React.PropTypes.number,
        facets: React.PropTypes.arrayOf(
            React.PropTypes.shape({
                name: React.PropTypes.string.isRequired,
                buckets,
                extra: buckets,
            })
        ),
        format: React.PropTypes.func.isRequired,
        getDate: React.PropTypes.func.isRequired,
        getTitle: React.PropTypes.func.isRequired,
        getUnit: React.PropTypes.func.isRequired,
        gettext: React.PropTypes.func.isRequired,
        lang: React.PropTypes.string.isRequired,
        maxDate: React.PropTypes.string.isRequired,
        minDate: React.PropTypes.string.isRequired,
        next: React.PropTypes.string,
        prev: React.PropTypes.string,
        queries: React.PropTypes.any.isRequired,
        query: React.PropTypes.any.isRequired,
        sorts: React.PropTypes.arrayOf(
            React.PropTypes.shape({
                id: React.PropTypes.string.isRequired,
                name: React.PropTypes.string.isRequired,
            })
        ),
        sources: React.PropTypes.arrayOf(
            React.PropTypes.shape({
                _id: React.PropTypes.string.isRequired,
                name: React.PropTypes.string.isRequired,
            })
        ),
        start: React.PropTypes.number,
        stringNum: React.PropTypes.func.isRequired,
        title: React.PropTypes.string.isRequired,
        total: React.PropTypes.number.isRequired,
        types: React.PropTypes.arrayOf(
            React.PropTypes.shape({
                id: React.PropTypes.string.isRequired,
                name: React.PropTypes.string.isRequired,
            })
        ),
        url: React.PropTypes.string,
    },

    renderSidebar() {
        return <div className="results-side col-sm-3 col-sm-push-9">
            <div className="panel panel-default facet">
                <div className="panel-heading">
                    <strong>{this.props.format(
                        this.props.gettext("%(numArtworks)s matches."),
                            {numArtworks: this.props.stringNum(
                                this.props.total)})}
                    </strong>
                    {" "}
                    {this.props.end && <span>{this.props.format(
                        this.props.gettext("Viewing %(start)s to %(end)s."),
                        {
                            start: this.props.stringNum(this.props.start),
                            end: this.props.stringNum(this.props.end),
                        }
                    )}</span>}
                </div>
                <div className="panel-body search-form">
                    {this.renderSearchForm()}
                </div>
            </div>
            {this.renderFacets()}
        </div>;
    },

    renderSearchForm() {
        const similarity = this.props.queries.similar.filters;

        return <form action={this.props.URL("/search")} method="GET">
            <input type="hidden" name="lang" value={this.props.lang}/>
            <div className="form-group">
                <label htmlFor="filter" className="control-label">
                    {this.props.gettext("Query")}
                </label>
                <input type="search" name="filter"
                    placeholder={this.props.gettext("Sample: christ or cristo")}
                    defaultValue={this.props.query.filter}
                    className="form-control"
                />
            </div>
            <NameFilter
                name="artist"
                placeholder={this.props.gettext("Sample: Andrea del Sarto")}
                title={this.props.gettext("Artist")}
                value={this.props.query.artist}
            />
            <LocationFilter
                name="location"
                placeholder={this.props.gettext("Sample: Louvre")}
                title={this.props.gettext("Location")}
                value={this.props.query.location}
            />
            <FixedStringFilter
                name="type"
                placeholder={this.props.gettext("Any Type")}
                title={this.props.gettext("Type")}
                value={this.props.query.types}
                values={this.props.types}
            />
            <div className="form-group">
                <label htmlFor="dateStart" className="control-label">
                    {this.props.gettext("Date")}
                </label>
                <div className="form-inline">
                    <input type="text" name="dateStart"
                        defaultValue={this.props.query.dateStart}
                        placeholder={this.props.minDate}
                        className="form-control date-control"
                    />
                    &mdash;
                    <input type="text" name="dateEnd"
                        defaultValue={this.props.query.dateEnd}
                        placeholder={this.props.maxDate}
                        className="form-control date-control"
                    />
                </div>
            </div>
            <div className="row">
                <div className="form-group col-xs-6 col-sm-12 col-lg-6">
                    <label htmlFor="widthMin" className="control-label">
                        {this.props.format(
                            this.props.gettext("Width (%(unit)s)"),
                                {unit: this.props.getUnit()})}
                    </label>
                    <div className="form-inline">
                        <input type="text" name="widthMin"
                            defaultValue={this.props.query.widthMin}
                            placeholder="10"
                            className="form-control size-control"
                        />
                        &mdash;
                        <input type="text" name="widthMax"
                            defaultValue={this.props.query.widthMax}
                            placeholder="200"
                            className="form-control size-control"
                        />
                    </div>
                </div>
                <div className="form-group col-xs-6 col-sm-12 col-lg-6">
                    <label htmlFor="heightMin" className="control-label">
                        {this.props.format(
                            this.props.gettext("Height (%(unit)s)"),
                            {unit: this.props.getUnit()})}
                    </label>
                    <div className="form-inline">
                        <input type="text" name="heightMin"
                            defaultValue={this.props.query.heightMin}
                            placeholder="10"
                            className="form-control size-control"
                        />
                        &mdash;
                        <input type="text" name="heightMax"
                            defaultValue={this.props.query.heightMax}
                            placeholder="200"
                            className="form-control size-control"
                        />
                    </div>
                </div>
            </div>
            <div className="form-group">
                <label htmlFor="source" className="control-label">
                    {this.props.gettext("Source")}
                </label>
                <select name="source" style={{width: "100%"}}
                    className="form-control"
                    defaultValue={this.props.query.source}
                >
                    <option value="">{this.props.gettext("Any Source")}</option>
                    {this.props.sources.map((source) =>
                        <option value={source._id} key={source._id}>
                            {source.name}
                        </option>
                    )}
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="similar" className="control-label">
                    {this.props.gettext("Similarity")}
                </label>
                <select name="similar" style={{width: "100%"}}
                    className="form-control"
                    defaultValue={this.props.query.similar}
                >
                    <option value=""></option>
                    {Object.keys(similarity).map((id) =>
                        <option value={id} key={id}>
                            {this.props.getTitle(similarity[id])}
                        </option>
                    )}
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="source" className="control-label">
                    {this.props.gettext("Sort")}
                </label>
                <select name="sort" style={{width: "100%"}}
                    className="form-control"
                    defaultValue={this.props.query.sort}
                >
                    {this.props.sorts.map((sort) =>
                        <option value={sort.id} key={sort.id}>
                            {sort.name}
                        </option>
                    )}
                </select>
            </div>
            <div className="form-group">
                <input type="submit" value={this.props.gettext("Search")}
                    className="btn btn-primary"
                />
            </div>
        </form>;
    },

    renderFacets() {
        return <div className="hidden-xs hidden-sm">
            {this.props.facets.map((facet) => this.renderFacet(facet))}
        </div>;
    },

    renderFacet(facet) {
        return <div className="panel panel-default facet" key={facet.name}>
            <div className="panel-heading">{facet.name}</div>
            <div className="panel-body">
                <ul>
                    {facet.buckets.map((bucket) => this.renderBucket(bucket))}
                </ul>

                {facet.extra && <div>
                    <button className="btn btn-default btn-xs toggle-facets">
                        {this.props.format(
                            this.props.gettext("Show %(count)s more..."),
                                {count: facet.extra.length})}
                    </button>

                    <div className="extra-facets">
                        <ul>
                            {facet.extra.map((bucket) =>
                                this.renderBucket(bucket))}
                        </ul>
                    </div>
                </div>}
            </div>
        </div>;
    },

    renderBucket(bucket) {
        return <li key={bucket.url}>
            <a href={bucket.url}>{bucket.text}</a>
            {" "}({bucket.count})
        </li>;
    },

    renderResults() {
        return <div className="results-main col-sm-9 col-sm-pull-3">
            {this.props.breadcrumbs.length > 0 && this.renderBreadcrumbs()}
            {this.props.artworks.length === 0 && this.renderNoResults()}
            {this.renderPagination()}
            <div className="row">
                {this.props.artworks.map((artwork) =>
                    this.renderResult(artwork))}
            </div>
            {this.renderPagination()}
        </div>;
    },

    renderBreadcrumbs() {
        return <div className="row">
            <div className="col-xs-12">
                <div className="btn-group" role="group">
                    {this.props.breadcrumbs.map((crumb) =>
                        this.renderBreadcrumb(crumb))}
                </div>
            </div>
        </div>;
    },

    renderBreadcrumb(crumb) {
        return <a href={crumb.url}
            className="btn btn-default btn-xs"
            key={crumb.url}
            title={this.props.format(this.props.gettext("Remove %(query)s"),
                {query: crumb.name})}
        >
            <span className="glyphicon glyphicon-remove-sign"
                style={{verticalAlign: -1}} aria-hidden="true"
            ></span>
            {" "}
            <span aria-hidden="true">{crumb.name}</span>
            <span className="sr-only">
                {this.props.format(this.props.gettext("Remove %(query)s"),
                    {query: crumb.name})}
            </span>
        </a>;
    },

    renderNoResults() {
        return <div className="row">
            <div className="col-xs-12">
                <div className="alert alert-info" role="alert">
                    {this.props.gettext(
                        "No results found. Please refine your query.")}
                </div>
            </div>
        </div>;
    },

    renderPagination() {
        return <nav>
            <ul className="pager">
                {this.props.prev && <li className="previous">
                    <a href={this.props.prev}>
                        <span aria-hidden="true">&larr;</span>
                        {this.props.gettext("Previous")}
                    </a>
                </li>}
                {this.props.next && <li className="next">
                    <a href={this.props.next}>
                        {this.props.gettext("Next")}
                        <span aria-hidden="true">&rarr;</span>
                    </a>
                </li>}
            </ul>
        </nav>;
    },

    renderResult(artwork) {
        return <div className="img col-xs-6 col-sm-4 col-md-3"
            key={artwork._id}
        >
            <div className="img-wrap">
                <a href={this.props.URL(artwork)}
                    title={this.props.getTitle(artwork)}
                >
                    <img src={artwork.getThumbURL()}
                        alt={this.props.getTitle(artwork)}
                        title={this.props.getTitle(artwork)}
                        className="img-responsive center-block"
                    />
                </a>
            </div>
            <div className="details">
                <div className="wrap">
                    {artwork.date &&
                        <span>{this.props.getDate(artwork.date)}</span>}

                    <a className="pull-right"
                        href={this.props.URL(artwork.getSource())}
                        title={artwork.getSource().getFullName(this.props.lang)}
                    >
                        {artwork.getSource().getShortName(this.props.lang)}
                    </a>
                </div>
            </div>
        </div>;
    },

    render() {
        return <Page
            {...this.props}
        >
            <div className="row">
                <div className="col-xs-12">
                    <h1>{this.props.title}</h1>
                    {this.props.url &&
                        <p><a href={this.props.url}>{this.props.url}</a></p>}
                </div>
            </div>
            <div className="row results-wrap">
                {this.renderSidebar()}
                {this.renderResults()}
            </div>
        </Page>;
    },
});

module.exports = Search;