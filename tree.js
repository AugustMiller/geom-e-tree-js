/*
	Tree Draft
	2013
*/

var Root,
	Configuration,
	Perf;

$(document).ready( function ( ) {
	Perf = new Date().getTime();
	Configuration = new TConfig({
		branches : 3,
		angle : 90,
		reduction : 0.5,
		depth : 4,
		artboard : document.getElementById('canvas').getContext("2d"),
		initial : -90
	});

	console.log(Configuration);

	var context = {
		length : 250,
		node : {
			x : 400,
			y : 600
		},
		angle : -45
	};

	$("#controls .angle").on( "change" , function ( ) {
		var angle = $(this).val();

		Configuration.angle = angle;

		Root.draw();
	});

	$("#controls .rf").on( "change" , function ( ) {
		var rf = $(this).val();

		Configuration.rf = rf;

		Root.draw();
	});

	$("#controls .branches").on( "change" , function ( ) {
		var branches = $(this).val();

		Configuration.branches = branches;

		Root = new Branch( Configuration , context , 0 , 0 );

		Root.draw();
	});

	Root = new Branch( Configuration , context , 0 , 0 );

	Root.draw();

	console.log( new Date().getTime() - Perf );
});

function TConfig ( options ) {
	var self = this;

	self.branches = options.branches || 2;
	self.angle    = options.angle || 90;
	self.rf       = options.reduction || 0.5;
	self.depth    = options.depth || 5;
	self.artboard = options.artboard || document.createElement('canvas');
	self.initial  = options.initial || 0;
}

function Branch ( config , parent , depth , id ) {
	var self = this;

	self.id = id;
	self.parent = parent;
	self.config = config;
	self.context = {};

	self.segment();

	self.branches = [];

	self.depth = depth;

	// console.log(config);

	for ( var b = 0; ( b < self.config.branches ) && ( depth < config.depth ); b++ ) {
		self.branches.push( new Branch( config , self.context , ( depth + 1 ) , b ) );
	}

	if ( self.isRoot() ) console.log(self);
}

Branch.prototype.draw = function ( ) {
	var self = this;


	if ( self.isRoot() ) {
		self.clear();
	} else {
		// 
	}

	self.segment();

	self.config.artboard.beginPath();
	self.config.artboard.moveTo( self.parent.node.x , self.parent.node.y );
	self.config.artboard.lineTo( self.context.node.x , self.context.node.y );

	// Pew Pew
	if ( self.depth % 2 ) {
		self.config.artboard.strokeStyle = 'rgba(255,100,100,0.5)';
	} else {
		self.config.artboard.strokeStyle = 'rgba(170,170,170,0.3)';
	}

	self.config.artboard.stroke();

	for ( var b = 0; b < self.branches.length; b++ ) {
		self.branches[b].draw();
	}
};

Branch.prototype.segment = function ( ) {
	var self = this,
		initial = 0 - ( ( self.config.angle * ( self.config.branches - 1 ) ) / 2 );

	if ( self.isRoot() ) {
		self.context.angle = self.config.initial;
	} else {
		self.context.angle = ( self.parent.angle + initial + ( self.config.angle * self.id ) );
	}

	self.context.length = ( self.parent.length * self.config.rf );

	self.context.node = {
		x : self.parent.node.x + ( self.context.length * self.config.rf ) * Math.cos( self.context.angle.toRad() ),
		y : self.parent.node.y + ( self.context.length * self.config.rf ) * Math.sin( self.context.angle.toRad() )
	};
};

Branch.prototype.clear = function ( ) {
	var self = this;

	self.config.artboard.clear();
};

Branch.prototype.isRoot = function ( ) {
	var self = this;

	if ( self.depth === 0 ) {
		return true;
	} else {
		return false;
	}
};

Branch.prototype.destroy = function ( ) {
	var self = this;

	for ( var b = 0; b < self.branches.length; b++ ) {
		self.branches[b].destroy();
		self.branches[b] = undefined;
	}
};

/*
	Shim to make clearing more consise
*/

CanvasRenderingContext2D.prototype.clear = CanvasRenderingContext2D.prototype.clear || function (preserveTransform) {
	if ( preserveTransform ) {
		this.save();
		this.setTransform(1, 0, 0, 1, 0, 0);
	}

	this.clearRect(0, 0, this.canvas.width, this.canvas.height);

	if ( preserveTransform ) {
		this.restore();
	}
};

/*
	Add .toRad() support in the native Number class
*/

if ( typeof Number.prototype.toRad === "undefined") {
	Number.prototype.toRad = function ( ) {
		return ( this * ( Math.PI / 180 ) );
 	}
}