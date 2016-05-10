"use strict";

const React = require("react");

const Page = require("./Page.jsx");

const NameView = require("./types/view/Name.jsx");
const LocationView = require("./types/view/Location.jsx");
const DimensionView = require("./types/view/Dimension.jsx");
const FixedStringView = require("./types/view/FixedString.jsx");

const artworkType = React.PropTypes.shape({
    artists: React.PropTypes.arrayOf(
        React.PropTypes.shape({
            _id: React.PropTypes.string,
            name: React.PropTypes.string.isRequired,
            pseudonym: React.PropTypes.string,
        })
    ),
    dates: React.PropTypes.arrayOf(
        React.PropTypes.shape({
            _id: React.PropTypes.string,
            original: React.PropTypes.string,
            circa: React.PropTypes.bool,
            end: React.PropTypes.number,
            start: React.PropTypes.number,
        })
    ),
    dimensions: React.PropTypes.arrayOf(
        React.PropTypes.shape({
            _id: React.PropTypes.string,
            height: React.PropTypes.number,
            width: React.PropTypes.number,
        })
    ),
    images: React.PropTypes.arrayOf(React.PropTypes.any),
    medium: React.PropTypes.string,
    objectType: React.PropTypes.string,
    title: React.PropTypes.string,
});

const Artwork = React.createClass({
    propTypes: {
        URL: React.PropTypes.func.isRequired,
        artworks: React.PropTypes.arrayOf(artworkType),
        compare: React.PropTypes.bool.isRequired,
        format: React.PropTypes.func.isRequired,
        fullName: React.PropTypes.func.isRequired,
        getDate: React.PropTypes.func.isRequired,
        getDimension: React.PropTypes.func.isRequired,
        getTitle: React.PropTypes.func.isRequired,
        getType: React.PropTypes.func.isRequired,
        getTypes: React.PropTypes.func.isRequired,
        gettext: React.PropTypes.func.isRequired,
        searchURL: React.PropTypes.func.isRequired,
        shortName: React.PropTypes.func.isRequired,
        similar: React.PropTypes.arrayOf(artworkType),
        stringNum: React.PropTypes.func.isRequired,
    },

    getTitle(artwork) {
        let title = artwork.title || "";

        if (artwork.objectType) {
            const type = this.props.getType(artwork);
            title = title ? `${type}: ${title}` : type;
        }

        return title;
    },

    renderArtwork() {
        const compare = this.props.compare;
        const artworks = this.props.artworks;
        const artworkWidth = this.props.similar.length > 0 ?
            "col-md-9" : "col-md-12";

        return <div className={`${artworkWidth} imageholder`}>
            {(compare || artworks.length > 1) &&
                <a href={this.props.URL(artworks[0])}
                    className="btn btn-success"
                >
                    &laquo; {this.props.gettext("End Comparison")}
                </a>}
            <div className="responsive-table">
                <table className="table table-hover">
                    <thead>
                        <tr className="plain">
                            <th></th>
                            {artworks.map((artwork) =>
                                this.renderTitle(artwork))}
                        </tr>
                        <tr className="plain">
                            <td></td>
                            {artworks.map((artwork) =>
                                this.renderImages(artwork))}
                        </tr>
                    </thead>
                    <tbody>
                        {(compare || artworks[0].artists.length > 0) && <tr>
                            <th className="text-right">
                                {this.props.gettext("Artist")}
                            </th>
                            {artworks.map((artwork) =>
                                this.renderArtist(artwork))}
                        </tr>}
                        {(compare || artworks[0].dates.length > 0) && <tr>
                            <th className="text-right">
                                {this.props.gettext("Date")}
                            </th>
                            {artworks.map((artwork) =>
                                this.renderDate(artwork))}
                        </tr>}
                        {(compare || artworks[0].objectType) && <tr>
                            <th className="text-right">
                                {this.props.gettext("Type")}
                            </th>
                            {artworks.map((artwork) =>
                                this.renderType(artwork))}
                        </tr>}
                        {(compare || artworks[0].medium) && <tr>
                            <th className="text-right">
                                {this.props.gettext("Medium")}
                            </th>
                            {artworks.map((artwork) =>
                                this.renderMedium(artwork))}
                        </tr>}
                        {(compare || artworks[0].dimensions.length > 0) && <tr>
                            <th className="text-right">
                                {this.props.gettext("Dimensions")}
                            </th>
                            {artworks.map((artwork) =>
                                this.renderDimensions(artwork))}
                        </tr>}
                        {(compare || artworks[0].categories.length > 0) && <tr>
                            <th className="text-right">
                                {this.props.gettext("Categories")}
                            </th>
                            {artworks.map((artwork) =>
                                this.renderCategories(artwork))}
                        </tr>}
                        {(compare || artworks[0].locations.length > 0) && <tr>
                            <th className="text-right">
                                {this.props.gettext("Location")}
                            </th>
                            {artworks.map((artwork) =>
                                this.renderLocation(artwork))}
                        </tr>}
                        {(compare || artworks[0].url) && <tr>
                            <th className="text-right">
                                {this.props.gettext("Details")}
                            </th>
                            {artworks.map((artwork) =>
                                this.renderDetails(artwork))}
                        </tr>}
                        <tr>
                            <th className="text-right">
                                {this.props.gettext("Source")}
                            </th>
                            {artworks.map((artwork) =>
                                this.renderSource(artwork))}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>;
    },

    renderTitle(artwork) {
        const size = Math.max(Math.round(12 / this.props.artworks.length), 3);
        const title = this.getTitle(artwork);

        return <th className={`col-xs-${size} text-center`} key={artwork._id}>
            <h1 className="panel-title">{title}</h1>
        </th>;
    },

    renderImages(artwork) {
        const carouselId = artwork._id.replace("/", "-");

        return <td key={artwork._id}>
            <div id={carouselId} className="carousel" data-interval="0">
                <div className="carousel-inner" role="listbox">
                    {artwork.images.map((image, i) =>
                        this.renderImage(artwork, image, i))}
                </div>

                {artwork.images.length > 1 && this.renderCarousel(artwork)}
            </div>
        </td>;
    },

    renderImage(artwork, image, i) {
        const active = i === 0 ? "active" : "";

        return <div className={`item ${active}`} key={image._id}>
            <a href={image.getOriginalURL()}>
                <img src={image.getScaledURL()}
                    alt={this.props.getTitle(artwork)}
                    title={this.props.getTitle(artwork)}
                    className="img-responsive center-block"
                />
            </a>
        </div>;
    },

    renderCarousel(artwork) {
        const carouselId = artwork._id.replace("/", "-");

        return <div>
            <ol className="carousel-indicators">
                {artwork.images.map((image, i) =>
                    <li data-target={`#${carouselId}`} data-slide-to={i}
                        className={i === 0 ? "active" : ""} key={`img${i}`}
                    ></li>
                )}
            </ol>
            <a className="left carousel-control"
                href={`#${carouselId}`} role="button"
                data-slide="prev"
            >
                <span className="glyphicon glyphicon-chevron-left"
                    aria-hidden="true"
                ></span>
                <span className="sr-only">
                    {this.props.gettext("Previous")}
                </span>
            </a>
            <a className="right carousel-control"
                href={`#${carouselId}`} role="button"
                data-slide="next"
            >
                <span className="glyphicon glyphicon-chevron-right"
                    aria-hidden="true"
                ></span>
                <span className="sr-only">
                    {this.props.gettext("Next")}
                </span>
            </a>
        </div>;
    },

    renderArtist(artwork) {
        return <td key={artwork._id}>
            <NameView
                name="artist"
                value={artwork.artists}
                searchURL={this.props.searchURL}
            />
        </td>;
    },

    renderDate(artwork) {
        return <td key={artwork._id}>
            {artwork.dates.map((date) => <span key={date._id}>
                <a href={this.props.searchURL({
                    dateStart: date.start,
                    dateEnd: date.end,
                })}
                >
                    {this.props.getDate(date)}
                </a><br/>
            </span>)}
        </td>;
    },

    renderType(artwork) {
        return <td key={artwork._id}>
            <FixedStringView
                name="type"
                searchURL={this.props.searchURL}
                value={artwork.objectType}
                values={this.props.getTypes()}
            />
        </td>;
    },

    renderMedium(artwork) {
        return <td key={artwork._id}>
            <FixedStringView
                name="medium"
                searchField="filter"
                searchURL={this.props.searchURL}
                value={artwork.medium}
            />
        </td>;
    },

    renderDimensions(artwork) {
        return <td key={artwork._id}>
            <DimensionView
                getDimension={this.props.getDimension}
                name="dimension"
                value={artwork.dimensions}
            />
        </td>;
    },

    renderCategories(artwork) {
        return <td key={artwork._id}>
            {artwork.categories.map((category, i) => <span key={category}>
                <a href={this.props.searchURL({filter: category})}>
                    {category}
                </a>
                {artwork.categories.length - 1 === i ? "" : ", "}
            </span>)}
        </td>;
    },

    renderLocation(artwork) {
        return <td key={artwork._id}>
            <LocationView
                name="location"
                searchURL={this.props.searchURL}
                value={artwork.locations}
            />
        </td>;
    },

    renderDetails(artwork) {
        const link = <a href={artwork.url}>
            {this.props.gettext("More information...")}</a>;

        return <td key={artwork._id}>{link}</td>;
    },

    renderSource(artwork) {
        const source = artwork.getSource();

        return <td key={artwork._id}>
            <a href={this.props.URL(source)}>
                {this.props.fullName(source)}
            </a>
        </td>;
    },

    renderSimilar() {
        return <div className="col-md-3">
            <a href="?compare" className="btn btn-success btn-block"
                style={{marginBottom: 20}}
            >
                {this.props.gettext("Compare Images")} &raquo;
            </a>

            <div className="panel panel-default">
                <div className="panel-heading">
                    {this.props.gettext("Similar Images")}
                </div>
                <div className="panel-body row">
                    {this.props.similar.map((match) =>
                        this.renderSimilarMatch(match))}
                </div>
            </div>
        </div>;
    },

    renderSimilarMatch(match) {
        if (!match.artwork) {
            return null;
        }

        return <div className="img col-md-12 col-xs-6 col-sm-4" key={match._id}>
            <a href={this.props.URL(match.artwork)}>
                <img src={match.artwork.getThumbURL()}
                    alt={this.props.getTitle(match.artwork)}
                    title={this.props.getTitle(match.artwork)}
                    className="img-responsive center-block"
                />
            </a>
            <div className="details">
                <div className="wrap">
                    <span>{this.props.format(this.props.gettext(
                        "Score: %(score)s"), {score: match.score})}</span>

                    <a className="pull-right"
                        href={this.props.URL(match.artwork.getSource())}
                        title={this.props.fullName(match.artwork.getSource())}
                    >
                        {this.props.shortName(match.artwork.getSource())}
                    </a>
                </div>
            </div>
        </div>;
    },

    renderScript() {
        return <script
            dangerouslySetInnerHTML={{__html: `
                $(function() {
                    $(".carousel").carousel();
                });
            `}}
        />;
    },

    render() {
        const artwork = this.props.artworks[0];
        const title = this.getTitle(artwork);
        const social = {
            imgURL: artwork.getOriginalURL(),
            title,
            url: this.props.URL(artwork),
        };

        return <Page
            {...this.props}
            title={title}
            scripts={this.renderScript()}
            social={social}
        >
            <div className="row">
                {this.renderArtwork()}
                {this.props.similar.length > 0 && this.renderSimilar()}
            </div>
        </Page>;
    },
});

module.exports = Artwork;